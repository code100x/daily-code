import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import { authOptions } from "../../../lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const notionId = body.notionId;
  const notion = new NotionAPI();
  try {
    const recordMap = await notion.getPage(notionId);
    const data = Object.keys(recordMap.block).map((key) => {
      const block = recordMap.block[key];
      return {
        notionDocId: block?.value.id,
        title: block?.value?.properties?.title[0][0],
      };
    });
    data.shift();
    data.pop();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(e);
  }
}
