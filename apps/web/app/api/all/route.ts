import { NextRequest, NextResponse } from "next/server";
import { getAllTracks } from "../../../components/utils";

export async function POST(req: NextRequest) {
  try {
    const url = req.url.replace(/\/api\/all/, "");
    const tracks = await getAllTracks();
    if (tracks) {
      const fetchPromises = tracks.map(async (track) => {
        try {
          return await fetch(`${url}/api/searchcontent?id=${track.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          throw new Error("Invalid");
        }
      });

      await Promise.all(fetchPromises);
    }
    return NextResponse.json({ data: "Done" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 404 });
  }
}
