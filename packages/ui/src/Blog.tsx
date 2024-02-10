"use client";
import { BlogAppbar } from "./BlogAppbar";
import { NotionRenderer } from "./NotionRenderer";
import { Problem, Track } from "@repo/store";

export const Blog = ({ problem, track, showAppBar }: { problem: Problem; track: Track; showAppBar: Boolean }) => {
  return (
    <div>
      {showAppBar && <BlogAppbar problem={problem} track={track} />}
      <NotionRenderer recordMap={problem.notionRecordMap} />
    </div>
  );
};
