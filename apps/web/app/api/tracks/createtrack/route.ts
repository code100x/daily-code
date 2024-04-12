import { Problem, Track } from "@prisma/client";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import db from "@repo/db/client";
import { AddTrackSchema } from "../../../../types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { newtrack } = body;
    const { success } = AddTrackSchema.safeParse(newtrack);

    if (!success) {
      return NextResponse.json({ error: "Invalid Input" }, { status: 404 });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(newtrack.notionUrl);
    await page.waitForSelector("a");

    const hrefs = await page.$$eval("a", (anchors) =>
      anchors.map((anchor) => ({
        href: anchor.getAttribute("href"),
        text: anchor.textContent,
      }))
    );

    await browser.close();

    const validHrefs = hrefs.filter((href) => href.href);

    const track = await db.track.create({
      data: {
        title: newtrack.title,
        description: newtrack.description,
        image: newtrack.imageUrl,
        createdAt: new Date(),
        problems: {
          create: validHrefs.map((href, index) => ({
            sortingOrder: index + 1,
            problem: {
              create: {
                title: href?.text,
                description: href?.text,
                notionDocId: href?.href?.substring(href.href.lastIndexOf("/") + 1),
                type: "Blog",
              },
            },
          })),
        },
      },
    });

    return NextResponse.json({ success: "trackCreated" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Something Went Wrong" }, { status: 500 });
  }
}
