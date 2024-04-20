import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import algoliasearch from "algoliasearch";
import { getTrack } from "../../../components/utils";
export interface algoliaobjSchema {
  objectID: string;
  title: string;
  problemId: string;
  ImgLink: string;
}

export async function POST(req: NextRequest) {
  try {
    const id: string = req.nextUrl.searchParams.get("id") || "";
    const track = await getTrack(id);
    if (track) {
      await Promise.all(
        track.problems.map(async (problem) => {
          try {
            await getAllBlocks(problem.id, problem.notionDocId, id, track.image);
          } catch (error) {
            return NextResponse.json({ error: "Invalid" }, { status: 404 });
          }
        })
      );
    }
    return NextResponse.json({ data: "Done" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 404 });
  }
}
async function getAllBlocks(problemId: string, notionid: string, trackID: string, ImgLink: string) {
  try {
    const notion = new NotionAPI();
    const page = await notion.getPage(notionid);
    const algoliaobjs = Getdetails(page, problemId, ImgLink);
    const res = await createIndex(algoliaobjs, trackID);
    return res;
  } catch (error) {
    return null;
  }
}
function Getdetails(page: any, problemId: string, ImgLink: string) {
  const titles = Object.values(page.block)
    .map((block) => ({
      title: block?.value?.properties?.title[0][0],
      id: block?.value?.id,
    }))
    .filter((block) => block.title);

  const objs: algoliaobjSchema[] = titles.map((item) => {
    return {
      objectID: item.id,
      title: item.title,
      problemId: problemId,
      ImgLink: ImgLink,
    };
  });
  return objs;
}

async function createIndex(obj: algoliaobjSchema[], trackID: string) {
  const client = algoliasearch(process.env.ALGOLIA_APP_ID || "", process.env.ALGOLIA_ADMIN_API_KEY || "");
  const index = client.initIndex(trackID);
  try {
    const res = await index.saveObjects(obj);
    return res;
  } catch (error) {
    return null;
  }
}
