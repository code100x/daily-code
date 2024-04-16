import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";

import { getTrack } from "../../../components/utils";
export async function GET(req: NextRequest) {
  try {
    const id: string = req.nextUrl.searchParams.get("id") || "";
    const track = await getTrack(id);
    if (track) {
      await Promise.all(
        track.problems.map(async (problem) => {
          await getAllBlocks(problem.notionDocId);
        })
      );
    }

    return NextResponse.json({ data: "Done" }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 404 });
  }
}

const getAllBlocks = async (id: string) => {
  try {
    const notion = new NotionAPI();
    const page = await notion.getPage(id);
    const blockIds = Object.keys(page.block);
    const block = await notion.getBlocks(blockIds);
    await saveToDb(block);
  } catch (error) {
    return null;
  }
};
async function saveToDb(block: any) {
  try {
    for (let key in block.recordMap.block) {
      if (block.recordMap.block.hasOwnProperty(key)) {
        const obj = block.recordMap.block[key];
        const value = obj?.value;
        const flattenedArray = flattenArray(value?.properties?.title);
        const wholeline = flattenedArray.join(",");
        console.log(value?.id);
        console.log(wholeline);
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
