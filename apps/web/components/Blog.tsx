"use client";
import { Problem, Track } from "@prisma/client";
import { BlogAppbar } from "./BlogAppbar";
import { NotionRenderer } from "./NotionRenderer";
import useMountStatus from "../hooks/useMountStatus";
import TrackTools from "./TrackTools";

export const Blog = ({
  problem,
  track,
  isPdfRequested,
  problemIndex,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar: Boolean;
  isPdfRequested?: Boolean;
  problemIndex: number;
}) => {
  const mounted = useMountStatus();

  if (isPdfRequested == undefined || !isPdfRequested) {
    if (!mounted) {
      return null;
    }
  }

  return (
    <div>
      <NotionRenderer recordMap={problem.notionRecordMap} />
      <div className="fixed top-0 w-full">
        <BlogAppbar problem={problem} track={track} problemIndex={problemIndex} />
      </div>
      <div className="fixed bottom-0 items-center  justify-center mx-auto w-full">
        <TrackTools allProblems={track.problems} track={track} problemIndex={problemIndex} />
      </div>
    </div>
  );
};
 