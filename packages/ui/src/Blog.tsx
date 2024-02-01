"use client";
import { BlogAppbar } from "./BlogAppbar";
import { NotionRenderer } from "./NotionRenderer";
import { Problem, Track } from "@repo/store";

export const Blog = ({ problem, track }: { problem: Problem; track: Track }) => {
  return (
    <div>
      <BlogAppbar problem={problem} track={track} />
      <NotionRenderer recordMap={problem.notionRecordMap} />
    </div>
  );
};
