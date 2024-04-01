import { Blog } from "./Blog";
import { CodeProblemRenderer } from "./CodeProblemRenderer";
import { Track, Problem } from "@repo/store";

export const LessonView = ({
  problem,
  track,
  showAppBar,
  isPdfRequested,
}: {
  problem: Problem;
  track: Track;
  showAppBar?: Boolean;
  isPdfRequested?: Boolean;
}) => {
  if (problem.type === "code") {
    return <CodeProblemRenderer track={track} problem={problem} />;
  }

  if (problem.type === "blog") {
    return <Blog problem={problem} track={track} showAppBar={!!showAppBar} isPdfRequested={isPdfRequested || false} />;
  }
  return <div>Not found</div>;
};
