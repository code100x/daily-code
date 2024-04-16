import { NotionAPI } from "notion-client";
import { getTrack } from "../components/utils";
import algoliasearch from "algoliasearch";
import db from "@repo/db/client";

export async function AddDatatoAlgolia({ trackId }: { trackId: string }) {
  const client = algoliasearch(process.env.AlGOLIA_APP_ID!, process.env.AlGOLIA_Admin_API!);
  try {
    const index = client.initIndex("DailyCode");

    const track = await getTrack(trackId);
    const notion = new NotionAPI();
    const data = await Promise.all(
      track?.problems.map(async (problem: any) => {
        const notionDocId = problem.notionDocId;
        const notionPage = await notion.getPage(notionDocId);
        const titles = Object.values(notionPage.block)
          .map((block) => block?.value?.properties?.title[0][0])
          .filter((title) => title);

        problem["titles"] = titles;
        problem["trackId"] = track.id;
        problem["trackTitle"] = track.title;
        problem["image"] = track.image;
        return problem;
      }) || []
    );
    index.saveObjects(data, { autoGenerateObjectIDIfNotExist: true });

    await db.track.update({
      where: {
        id: trackId,
      },
      data: {
        inSearch: true,
      },
    });

    return data;
  } catch (e) {
    return e;
  }
}
