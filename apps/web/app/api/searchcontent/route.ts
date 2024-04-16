import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import algoliasearch from "algoliasearch";

export interface algoliaobjSchema {
  objectID: string;
  title: string;
}

import { getTrack } from "../../../components/utils";
export async function GET(req: NextRequest) {
  try {
    const id: string = req.nextUrl.searchParams.get("id") || "";
    const track = await getTrack(id);
    if (track) {
      await Promise.all(
        track.problems.map(async (problem) => {
          await getAllBlocks(problem.notionDocId, id);
        })
      );
    }

    return NextResponse.json({ data: "Done" }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 404 });
  }
}
async function createIndex(obj: algoliaobjSchema, problemId: string, trackID: string) {
  const client = algoliasearch(process.env.ALGOLIA_APP_ID || "", process.env.ALGOLIA_ADMIN_API_KEY || "");
  const indexName = problemId + " " + trackID;
  const index = client.initIndex(indexName);
  try {
    await index.saveObject(obj);
  } catch (error) {
    return null;
  }
}
async function getAllBlocks(problemId: string, trackID: string) {
  try {
    const notion = new NotionAPI();
    const page = await notion.getPage(problemId);
    const blockIds = Object.keys(page.block);
    const block = await notion.getBlocks(blockIds);
    const algoliaobj = await Getdetails(block);
    if (algoliaobj) {
      await createIndex(algoliaobj, problemId, trackID);
    }
  } catch (error) {
    return null;
  }
}
async function Getdetails(block: any) {
  try {
    for (let key in block.recordMap.block) {
      if (block.recordMap.block.hasOwnProperty(key)) {
        const obj = block.recordMap.block[key];
        const value = obj?.value;
        const flattenedArray = flattenArray(value?.properties?.title);
        const wholeline = flattenedArray.join(",");
        if (value) {
          return {
            objectID: value.id,
            title: wholeline,
          };
        } else {
          continue;
        }
      }
    }
  } catch (e) {
    return null;
  }
}
function getMaxDepth(arr: any) {
  if (!Array.isArray(arr)) {
    return 0;
  }

  let maxDepth = 0;
  for (const element of arr) {
    if (Array.isArray(element)) {
      const depth = getMaxDepth(element);
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    }
  }

  return maxDepth + 1;
}

function flattenArray(arr: any) {
  const maxDepth = getMaxDepth(arr);
  return arr.flat(maxDepth);
}
