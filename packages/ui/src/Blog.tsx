"use client";
import { Problem, Track } from "@prisma/client";
import { BlogAppbar } from "./BlogAppbar";
import { NotionRenderer } from "./NotionRenderer";
import useMountStatus from "./hooks/useMountStatus";

export const Blog = ({
  problem,
  track,
  showAppBar,
  isPdfRequested,
  allTracks,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar: Boolean;
  isPdfRequested?: Boolean;
  allTracks: Track[] & { problems: Problem[] };
}) => {
  const mounted = useMountStatus();

  if (isPdfRequested == undefined || !isPdfRequested) {
    if (!mounted) {
      return null;
    }
  }

  return (
    <div>
      {showAppBar && <BlogAppbar problem={problem} track={track} allTracks={allTracks} />}
      <NotionRenderer recordMap={problem.notionRecordMap} />
    </div>
  );
};
