import { Blog } from "./Blog";
import { CodeProblemRenderer } from "./CodeProblemRenderer";
import { Track, Problem } from "@repo/store";

export const LessonView = ({
  problem,
  track,
  showAppBar,
}: {
  problem: Problem;
  track: Track;
  showAppBar?: Boolean;
}) => {
  if (problem.type === "code") {
    return <CodeProblemRenderer track={track} problem={problem} />;
  }

  if (problem.type === "blog") {
    return <Blog problem={problem} track={track} showAppBar={!!showAppBar} />;
  }
  return <div>Not found</div>;
};
