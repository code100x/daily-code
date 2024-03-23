"use client";
import { Problem, Track } from "@repo/store";
import { BlogAppbar } from "./BlogAppbar";
import { NotionRenderer } from "./NotionRenderer";
import useMountStatus from "./hooks/useMountStatus";

export const Blog = ({ problem, track, showAppBar, isPdfRequested }: { problem: Problem; track: Track; showAppBar: Boolean, isPdfRequested: Boolean }) => {
  const mounted = useMountStatus();

  if(isPdfRequested == undefined || !isPdfRequested)
  {
    if (!mounted) {
      return null;
    }
  }

  return (
    <div>
      {showAppBar && <BlogAppbar problem={problem} track={track} />}
      <NotionRenderer recordMap={problem.notionRecordMap} />
    </div>
  );
};
