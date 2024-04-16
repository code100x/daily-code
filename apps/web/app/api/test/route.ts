import { NextResponse } from "next/server";
import db from "@repo/db/client";
import { AddDatatoAlgolia } from "../../../lib/AddDatatoAlgolia";

export async function GET() {
  let data = [];
  const AllTracks = await db.track.findMany();
  for (const track of AllTracks) {
    try {
      const a = await AddDatatoAlgolia({ trackId: track.id });
      data.push(a);
    } catch (e) {
      console.log(track.title);
    }
  }
  return NextResponse.json(data.length);
}
