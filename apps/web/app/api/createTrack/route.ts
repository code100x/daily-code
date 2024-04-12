import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";
import db from "../../../../../packages/db/src";
import { Problem } from "../../../../../packages/store/src/atoms";

export async function POST(req: NextRequest) {
  const notionLink = req.nextUrl.searchParams.get("link");
  const description = req.nextUrl.searchParams.get("description") || "";
  const image = req.nextUrl.searchParams.get("image") || "";
  const type = req.nextUrl.searchParams.get("type");
  if (!notionLink || !description || !image) {
    return NextResponse.json({ message: "Invalid inputs to create a Track" }, { status: 401 });
  }
  try {
    const notionData = await feedNotionToDB(notionLink, description, image, type);
    const dbRes = await db.track.create({ data: { ...notionData } });
    return NextResponse.json({ message: "Notion upload to DB Succesfully!", dbRes }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server error!" }, { status: 501 });
  }
}

const extractInfoFromNotionLink = (link: string) => {
  var pattern = /https:\/\/petal-estimate-4e9\.notion\.site\/([^\/]+)-([\w-]+)$/;

  var match = link.match(pattern);

  if (match && match[1]) {
    var title: string = match[1].replace(/-/g, " ");
    var id: string = match[2] || "";
    return { title: title, id: id };
  } else {
    return null;
  }
};

const feedNotionToDB = async (notionlink: string, description: string, image: string, type: string) => {
  const notion = new NotionAPI();
  var { title, id } = extractInfoFromNotionLink(notionlink);
  const pages = await notion.getPage(id);
  const data = await notion.getBlocks(Object.keys(pages.block));
  const problems: Problem[] = [];
  var count = Object.keys(data.recordMap.block).length;
  for (const key in data.recordMap.block) {
    const returnObj = {
      problem: {
        create: {
          description: data.recordMap.block[key]?.value.properties.title[0][0],
          title: data.recordMap.block[key]?.value.properties.title[0][0],
          type,
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
    id: title.replaceAll(" ", "-"),
    title,
    description,
    image,
    problems: { create: problems.reverse() },
  };
};
