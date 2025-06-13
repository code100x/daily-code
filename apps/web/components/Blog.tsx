"use client";
import { useRecoilValue } from "recoil";

import { Problem, Track } from "@prisma/client";
import { isLegacyViewMode } from "@repo/store";

import { BlogAppbar } from "./BlogAppbar";
import { NotionRenderer } from "./NotionRenderer";
import useMountStatus from "../hooks/useMountStatus";
import TrackTools from "./TrackTools";
import CustomPagination from "./CustomPagination";

export const Blog = ({
  problem,
  track,
  showAppBar,
  showPagination,
  isPdfRequested,
  problemIndex,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar?: boolean;
  showPagination?: boolean;
  isPdfRequested?: boolean;
  problemIndex: number;
}) => {
  const mounted = useMountStatus();
  const isLegacyMode = useRecoilValue(isLegacyViewMode);

  if (isPdfRequested == undefined || !isPdfRequested) {
    if (!mounted) {
      return null;
    }
  }

  const renderBlog = () =>
    isLegacyMode ? (
      <div className="break-after-page">
        {showAppBar && <BlogAppbar problem={problem} track={track} problemIndex={problemIndex} />}
        <NotionRenderer recordMap={problem.notionRecordMap} />
        {showPagination && (
          <div className="justify-center pt-2">
            <CustomPagination allProblems={track.problems} track={track} problemIndex={problemIndex} />
          </div>
        )}
      </div>
    ) : (
      <div>
        <NotionRenderer recordMap={problem.notionRecordMap} />
        <div className="fixed top-0 w-full">
          <BlogAppbar problem={problem} track={track} problemIndex={problemIndex} />
        </div>
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <TrackTools allProblems={track.problems} track={track} problemIndex={problemIndex} />
        </div>
      </div>
    );

  return renderBlog();
};
