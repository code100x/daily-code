import { NotionAPI } from "notion-client";
import { HttpsProxyAgent } from "https-proxy-agent";

function normalizeBlocks(block: any) {
  if (!block) return {};
  const normalizedBlock: any = {};
  for (const [key, b] of Object.entries(block) as any) {
    if (!b?.value) continue;
    const value = b.value;
    if (!value.type && value.value?.type) {
      normalizedBlock[key] = { ...b, value: value.value };
    } else {
      normalizedBlock[key] = b;
    }
  }
  return normalizedBlock;
}

function collectContentBlockIds(recordMap: any): string[] {
  const blocks = recordMap?.block;
  if (!blocks) return [];
  const rootId = Object.keys(blocks)[0];
  if (!rootId) return [];

  const seen = new Set<string>();
  const walk = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    const value = blocks[id]?.value;
    if (!value) return;
    if (id !== rootId && (value.type === "page" || value.type === "collection_view_page")) return;
    if (Array.isArray(value.content)) {
      for (const childId of value.content) walk(childId);
    }
    const refId = value.format?.transclusion_reference_pointer?.id;
    if (refId) walk(refId);
  };
  walk(rootId);
  return Array.from(seen);
}

// --- Why this file looks the way it does -------------------------------------
// Notion serves its unofficial `/api/v3` endpoints behind Cloudflare. Requests from our
// k8s datacenter egress IP get hard-blocked with a 403 "Attention Required" Cloudflare
// page on the endpoints notion-client normally uses (`loadPageChunk`, `syncRecordValues`,
// `queryCollection`), which took down every track/problem page with a 500.
//
// Empirically, `loadCachedPageChunkV2` is NOT blocked from the cluster and returns the
// full page recordMap in a single request, so we fetch through that endpoint directly
// (via the client's public `fetch`) instead of `getPage`. We also authenticate with
// NOTION_TOKEN_V2 (private-page access) and aggressively throttle + cache, because the
// block is IP-reputation based: bursts of requests re-trigger a broader Cloudflare block,
// so keeping request volume low is what keeps this endpoint working.
let notionSingleton: NotionAPI | null = null;

export function getNotionClient(): NotionAPI {
  if (notionSingleton) return notionSingleton;
  notionSingleton = new NotionAPI({
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    authToken: process.env.NOTION_TOKEN_V2 || undefined,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    activeUser: process.env.NOTION_ACTIVE_USER || undefined,
  });
  return notionSingleton;
}

// Optional egress proxy. Because Notion's Cloudflare block is IP-reputation based, the
// fully-robust fix is to route requests through a clean/non-datacenter IP. When
// NOTION_PROXY_URL is set (e.g. http://user:pass@host:port), all Notion calls tunnel
// through it — which also unblocks the endpoints loadCachedPageChunkV2 can't cover
// (images via getSignedFileUrls, embedded DBs via queryCollection). Inert when unset.
let gotOptionsCache: { agent: { https: HttpsProxyAgent<string> } } | undefined | null = null;

function getGotOptions() {
  if (gotOptionsCache !== null) return gotOptionsCache;
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const proxy = process.env.NOTION_PROXY_URL;
  gotOptionsCache = proxy ? { agent: { https: new HttpsProxyAgent(proxy) } } : undefined;
  return gotOptionsCache;
}

// Two-tier cache: `fresh` entries are served within TTL; `stale` entries never expire and
// are the fallback when Notion is unreachable/blocked, so a transient block degrades to
// slightly-stale content instead of a 500. Long TTL keeps refetch volume (and IP-flag
// risk) low; content changes rarely.
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
type CacheEntry = { recordMap: any; ts: number };
const cache = new Map<string, CacheEntry>();
const staleCache = new Map<string, any>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Global throttle across all concurrent renders sharing this process. Notion's Cloudflare
// block is triggered by request bursts, and the PDF route in particular fetches every
// problem of a track in parallel, so we cap concurrency and space requests out.
const MAX_CONCURRENCY = 2;
const MIN_GAP_MS = 250;
let active = 0;
let lastStart = 0;
const waiters: Array<() => void> = [];

async function acquireSlot() {
  if (active >= MAX_CONCURRENCY) {
    await new Promise<void>((resolve) => waiters.push(resolve));
  }
  active++;
  const wait = lastStart + MIN_GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastStart = Date.now();
}

function releaseSlot() {
  active--;
  const next = waiters.shift();
  if (next) next();
}

function isForbidden(err: any): boolean {
  const status = err?.response?.statusCode ?? err?.response?.status;
  return status === 403 || /403/.test(err?.message || "");
}

async function loadPageViaCachedChunk(notion: NotionAPI, pageId: string): Promise<any> {
  // notion-client's typed `fetch` reuses auth (token_v2 cookie) and error handling.
  const res: any = await notion.fetch({
    endpoint: "loadCachedPageChunkV2",
    body: { pageId, limit: 100, cursor: { stack: [] }, chunkNumber: 0, verticalColumns: false },
    gotOptions: getGotOptions(),
  });

  const recordMap = res?.recordMap ?? {};
  recordMap.block = normalizeBlocks(recordMap.block);
  // react-notion-x expects these maps to exist even when empty.
  recordMap.collection = recordMap.collection ?? {};
  recordMap.collection_view = recordMap.collection_view ?? {};
  recordMap.notion_user = recordMap.notion_user ?? {};
  recordMap.collection_query = recordMap.collection_query ?? {};
  recordMap.signed_urls = recordMap.signed_urls ?? {};

  if (!recordMap.block || Object.keys(recordMap.block).length === 0) {
    throw new Error(`Notion page not found "${pageId}"`);
  }

  const missing = collectContentBlockIds(recordMap).filter((id) => !recordMap.block[id]);
  if (missing.length) {
    // loadCachedPageChunkV2 returns the full page tree in practice; if a handful of nested
    // blocks are missing we render what we have rather than hitting the (blocked)
    // syncRecordValues endpoint.
    console.warn(`[notion] ${pageId}: ${missing.length} nested block(s) missing from cached chunk`);
  }

  return recordMap;
}

async function fetchWithRetry(notion: NotionAPI, pageId: string): Promise<any> {
  const attempts = 4;
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    await acquireSlot();
    try {
      return await loadPageViaCachedChunk(notion, pageId);
    } catch (err) {
      lastErr = err;
      // Back off harder on Cloudflare 403s to let the IP-reputation block cool down.
      if (i < attempts - 1) {
        const base = isForbidden(err) ? 1500 : 300;
        await sleep(base * 2 ** i);
      }
    } finally {
      releaseSlot();
    }
  }
  throw lastErr;
}

export async function fetchNotionPage(notion: NotionAPI, pageId: string): Promise<any> {
  if (!pageId) return null;

  const cached = cache.get(pageId);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.recordMap;
  }

  try {
    const recordMap = await fetchWithRetry(notion, pageId);
    cache.set(pageId, { recordMap, ts: Date.now() });
    staleCache.set(pageId, recordMap);
    return recordMap;
  } catch (err) {
    // Serve the last good version if we have one, so an upstream Notion/Cloudflare failure
    // doesn't 500 the whole page.
    const stale = staleCache.get(pageId);
    if (stale) {
      console.error(`[notion] fetch failed for ${pageId}, serving stale content:`, (err as Error)?.message);
      return stale;
    }
    console.error(`[notion] fetch failed for ${pageId} with no cached fallback:`, (err as Error)?.message);
    return null;
  }
}
