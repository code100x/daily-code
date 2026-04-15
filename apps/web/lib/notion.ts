import { NotionAPI } from "notion-client";

function normalizeRecordMap(recordMap: any) {
  if (!recordMap?.block) return recordMap;
  const normalizedBlock: any = {};
  for (const [key, block] of Object.entries(recordMap.block) as any) {
    if (!block?.value) continue;
    const value = block.value;
    if (!value.type && value.value?.type) {
      normalizedBlock[key] = { ...block, value: value.value };
    } else if (value.type) {
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

// Notion's API now returns blocks in a nested `value.value` shape. notion-client's
// built-in missing-block traversal walks the raw map and can't see past that nesting,
// so toggle children (and other nested descendants) never get fetched. We disable its
// traversal, normalize the shape, then manually fetch descendants until the tree is
// complete.
export async function fetchNotionPage(notion: NotionAPI, pageId: string): Promise<any> {
  let recordMap: any = await notion.getPage(pageId, { fetchMissingBlocks: false });
  recordMap = normalizeRecordMap(recordMap);

  for (let i = 0; i < 10; i++) {
    const missing = collectContentBlockIds(recordMap).filter((id) => !recordMap.block[id]);
    if (!missing.length) break;
    const fetched = await notion.getBlocks(missing).then((r: any) => r.recordMap.block);
    recordMap = normalizeRecordMap({ ...recordMap, block: { ...recordMap.block, ...fetched } });
  }

  return recordMap;
}
