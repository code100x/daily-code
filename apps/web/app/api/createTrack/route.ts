import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { NotionAPI } from "notion-client";
import db from "../../../../../packages/db/src";
import { Problem } from "../../../../../packages/store/src/atoms";

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("secret");
  const notionLink = req.nextUrl.searchParams.get("link");
  const description = req.nextUrl.searchParams.get("description") || "";
  const image = req.nextUrl.searchParams.get("image") || "";
  if (token || !notionLink) {
    //Add the token logic here
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  try {
    const notionData = await feedNotionToDB(notionLink, description, image);
    const dbRes = await db.track.create({ data: { ...notionData } });
    return NextResponse.json({ message: "Notion upload to DB Succesfully!", dbRes }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Internal Server error!" }, { status: 501 });
  }
}

const extractInfoFromNotionLink = (link: string) => {
  var pattern = /https:\/\/petal-estimate-4e9\.notion\.site\/([^\/]+)-([\w-]+)$/;

  var match = link.match(pattern);

  if (match && match[1]) {
    var title = match[1].replace(/-/g, " ");
    var uuid = match[2];
    return { title: title, uuid: uuid };
  } else {
    return null;
  }
};

const feedNotionToDB = async (notionlink: string, description: string, image: string) => {
  const notion = new NotionAPI();
  var { title, uuid } = extractInfoFromNotionLink(notionlink);
  const pages = await notion.getPage(uuid);
  const data = await notion.getBlocks(Object.keys(pages.block));
  const problems: Problem[] = [];
  var count = Object.keys(data.recordMap.block).length;
  for (const key in data.recordMap.block) {
    const returnObj = {
      problem: {
        create: {
          description: data.recordMap.block[key]?.value.properties.title[0][0],
          title: data.recordMap.block[key]?.value.properties.title[0][0],
          type: "Blog",
          notionDocId: key.replaceAll("-", ""),
          id: data.recordMap.block[key]?.value.id || "",
        },
      },
      sortingOrder: count,
    };
    count -= 1;
    problems.push(returnObj);
  }
  return {
    id: randomUUID().replaceAll("-", ""),
    title,
    description,
    image,
    problems: { create: problems.reverse() },
  };
};
