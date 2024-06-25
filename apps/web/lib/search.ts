"use server";
import { NotionAPI } from "notion-client";
import { getTrack } from "../components/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QdrantClient } from "@qdrant/js-client-rest";
import { randomUUID } from "crypto";
import db from "@repo/db/client";

const client = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});
const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "embedding-001"});

const VECTOR_SIZE = parseInt(process.env.VECTOR_SIZE!) || 768;

export async function scrapeData({ trackId }: { trackId: string }) {
  const notion = new NotionAPI();
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
      problem["titles"] = titles.flat().join(" ");
      problem["trackId"] = track.id;
      problem["trackTitle"] = track.title;
      problem["image"] = track.image;
      return problem;
    }) || []
  );
  return data;
}

export async function createCollection(){
  await client.createCollection("DailyCode",{
    vectors:{ size: VECTOR_SIZE , distance: "Dot" },
  });
}

export async function insertData(trackId: string) {
  const data = await scrapeData({ trackId });
  data.forEach(async (problem) => {
    const response = await model.embedContent(problem.titles);
    problem.vector = response.embedding.values.slice(0, VECTOR_SIZE);
    await client.upsert("DailyCode", {
      wait: true,
      points: [
        {
          id: randomUUID(),
          vector: problem.vector,
          payload: {
            trackId: problem.trackId,
            trackTitle: problem.trackTitle,
            image: problem.image,
            problemTitle: problem.title,
            problemId: problem.id,
          },
        },
      ],
    });
  });
  await db.track.update({
    where: {
      id: trackId,
    },
    data: {
      inSearch: true,
    },
  });
}

export async function getSearchResults(query: string) {
  const vector = await model.embedContent(query);
  const response = await client.search("DailyCode", {
    vector: vector.embedding.values.slice(0, VECTOR_SIZE),
    limit: 5,
  });
  return response;
}