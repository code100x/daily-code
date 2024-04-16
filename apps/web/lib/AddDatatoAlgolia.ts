import { NotionAPI } from "notion-client";
import { getTrack } from "../components/utils";
import algoliasearch from "algoliasearch";

export async function AddDatatoAlgolia({ trackId }: { trackId: string }) {
  const client = algoliasearch("7HC945FD4D", "c2e3c2e58d6978ed455db828e773da06");
  try {
    const index = client.initIndex("DailyCode");

    const track = await getTrack(trackId);
    const notion = new NotionAPI();
    //@ts-ignore
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
      })
    );
    // @ts-ignore
    index.saveObjects(data, { autoGenerateObjectIDIfNotExist: true });

    return data;
  } catch (e) {
    return e;
  }
}
