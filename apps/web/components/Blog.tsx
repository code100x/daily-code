"use client";
import { Problem, Track } from "@prisma/client";
import { BlogAppbar } from "./BlogAppbar";
import { NotionRenderer } from "./NotionRenderer";
import useMountStatus from "../hooks/useMountStatus";
import Pagination from "./Pagination";

export const Blog = ({
  problem,
  track,
  showAppBar,
  isPdfRequested,
  problemIndex
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar: Boolean;
  isPdfRequested?: Boolean;
  problemIndex: number
}) => {
  const mounted = useMountStatus();

  if (isPdfRequested == undefined || !isPdfRequested) {
    if (!mounted) {
      return null;
    }
  }

  return (
    <div>
      {showAppBar && <BlogAppbar problem={problem} track={track} problemIndex={problemIndex}/>}
      <NotionRenderer recordMap={problem.notionRecordMap} />
      <div className="justify-center pt-2">
        <Pagination allProblems={track.problems} track={track} problemIndex={problemIndex} />
      </div>
    </div>
  );
};
