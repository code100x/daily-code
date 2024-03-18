"use client";
import { Problem, Track } from "@repo/store";
import { BlogAppbar } from "./BlogAppbar";
import { NotionRenderer } from "./NotionRenderer";
import useMountStatus from "./hooks/useMountStatus";

export const Blog = ({ problem, track }: { problem: Problem; track: Track }) => {
  const mounted = useMountStatus();

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <BlogAppbar problem={problem} track={track} />
      <NotionRenderer recordMap={problem.notionRecordMap} />
    </div>
  );
};
