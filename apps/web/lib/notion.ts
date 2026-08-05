import { NotionAPI } from "notion-client";

function normalizeRecordMap(recordMap: any) {
  if (!recordMap?.block) return recordMap;
  const normalizedBlock: any = {};
  for (const [key, block] of Object.entries(recordMap.block) as any) {
    if (!block?.value) continue;
    const value = block.value;
    if (!value.type && value.value?.type) {
      normalizedBlock[key] = { ...block, value: value.value };
    } else {
      normalizedBlock[key] = block;
    }
  }
  return { ...recordMap, block: normalizedBlock };
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

// Notion serves its unofficial (`/api/v3`) endpoints behind Cloudflare. Requests from
// datacenter IPs (e.g. our k8s egress) can get hard-blocked with a 403 "Attention
// Required" Cloudflare page on endpoints like `loadPageChunk`, which previously took
// down every track/problem page with a 500. Authenticating with a Notion session token
// (NOTION_TOKEN_V2) makes those requests far less likely to be challenged.
//
// A process-wide NotionAPI singleton is reused so we don't re-parse config per request.
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

// Two-tier cache: `fresh` entries are served directly within TTL; `stale` entries never
// expire and are used as a fallback when Notion is unreachable/blocked, so a transient
// Cloudflare block degrades to slightly-stale content instead of a 500. Caching also
// slashes the request volume that was keeping our IP flagged.
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
type CacheEntry = { recordMap: any; ts: number };
const cache = new Map<string, CacheEntry>();
const staleCache = new Map<string, any>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await sleep(300 * 2 ** i);
    }
  }
  throw lastErr;
}

async function fetchNotionPageUncached(notion: NotionAPI, pageId: string): Promise<any> {
  let recordMap: any = await withRetry(() => notion.getPage(pageId, { fetchMissingBlocks: false }));
  recordMap = normalizeRecordMap(recordMap);

  for (let i = 0; i < 10; i++) {
    const missing = collectContentBlockIds(recordMap).filter((id) => !recordMap.block[id]);
    if (!missing.length) break;
    const fetched = await withRetry(() => notion.getBlocks(missing).then((r: any) => r.recordMap.block));
    recordMap = normalizeRecordMap({ ...recordMap, block: { ...recordMap.block, ...fetched } });
  }

  return recordMap;
}

// Notion's API now returns blocks in a nested `value.value` shape. notion-client's
// built-in missing-block traversal walks the raw map and can't see past that nesting,
// so toggle children (and other nested descendants) never get fetched. We disable its
// traversal, normalize the shape, then manually fetch descendants until the tree is
// complete.
export async function fetchNotionPage(notion: NotionAPI, pageId: string): Promise<any> {
  if (!pageId) return null;

  const cached = cache.get(pageId);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.recordMap;
  }

  try {
    const recordMap = await fetchNotionPageUncached(notion, pageId);
    cache.set(pageId, { recordMap, ts: Date.now() });
    staleCache.set(pageId, recordMap);
    return recordMap;
  } catch (err) {
    // Fall back to the last successfully fetched version if we have one, so an upstream
    // Notion/Cloudflare failure doesn't 500 the whole page.
    const stale = staleCache.get(pageId);
    if (stale) {
      console.error(`[notion] fetch failed for ${pageId}, serving stale content:`, (err as Error)?.message);
      return stale;
    }
    console.error(`[notion] fetch failed for ${pageId} with no cached fallback:`, (err as Error)?.message);
    return null;
  }
}
