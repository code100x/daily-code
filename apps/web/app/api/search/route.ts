import algoliasearch from "algoliasearch";
import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const searchText = body.input;
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
    return NextResponse.json(hitsData);
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
