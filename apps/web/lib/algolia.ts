"use server"
import { NotionAPI } from "notion-client";
import algoliasearch from "algoliasearch";
import db from "@repo/db/client";
import { getTrack } from "../components/utils";

export async function AddDatatoAlgolia({ trackId }: { trackId: string }) {
    const client = algoliasearch(process.env.AlGOLIA_APP_ID!, process.env.AlGOLIA_Admin_API!);
    const notion = new NotionAPI();
    try {
      const index = client.initIndex("DailyCode");
      const track = await getTrack(trackId);
      const data = await Promise.all(
        track?.problems.map(async (problem: any) => {
          const notionDocId = problem.notionDocId;
          const notionPage = await notion.getPage(notionDocId);
          const titles = Object.values(notionPage.block)
            .map((block) => {
              const title = block?.value?.properties?.title;
              if (title && title[0] && title[0][0]) {
                return title[0][0];
              } else {
                const source = block?.value?.properties?.source;
                if (source && source[0] && source[0][0]) {
                  return source[0][0];
                } else {
                  return null;
                }
              }
            })
            .filter((title) => title);
  
          problem["titles"] = titles.flat();
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
      return [];
    }
  }

  export async function getSearch(searchText: string) {
    const client = algoliasearch(process.env.AlGOLIA_APP_ID!, process.env.AlGOLIA_Admin_API!);
    try {
      const index = client.initIndex("DailyCode");
      const data = await index.search(searchText);
      let hitsData = data.hits.map((hit: any) => {
        return {
          id: hit.id,
          notionDocId: hit.notionDocId,
          title: hit.title,
          trackId: hit.trackId,
          trackTitle: hit.trackTitle,
          image: hit.image,
        };
      });
      return hitsData;
    } catch (e) {
      return e;
    }
  }