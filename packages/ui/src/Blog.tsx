"use client";
import { AllProblems, Problem, Track } from "@repo/store";
import { BlogAppbar } from "./BlogAppbar";
import { NotionRenderer } from "./NotionRenderer";
import useMountStatus from "./hooks/useMountStatus";

export const Blog = ({
  problem,
  track,
  allProblems,
  showAppBar,
  isPdfRequested,
}: {
  problem: Problem;
  track: Track;
  allProblems: AllProblems[];
  showAppBar: Boolean;
  isPdfRequested: Boolean;
}) => {
  const mounted = useMountStatus();

  if (isPdfRequested == undefined || !isPdfRequested) {
    if (!mounted) {
      return null;
    }
  }

  return (
    <div>
      {showAppBar && <BlogAppbar problem={problem} track={track} allProblems={allProblems} />}
      <NotionRenderer recordMap={problem.notionRecordMap} />
    </div>
  );
};
