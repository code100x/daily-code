import { Blog } from "./Blog";
import { CodeProblemRenderer } from "./CodeProblemRenderer";
import { Track, Problem, AllProblems } from "@repo/store";

export const LessonView = ({
  problem,
  track,
  allProblems,
  showAppBar,
  isPdfRequested,
}: {
  problem: Problem;
  track: Track;
  allProblems: AllProblems[];
  showAppBar?: Boolean;
  isPdfRequested?: Boolean;
}) => {
  if (problem.type === "code") {
    return <CodeProblemRenderer track={track} problem={problem} />;
  }

  if (problem.type === "blog") {
    return (
      <Blog
        problem={problem}
        track={track}
        allProblems={allProblems}
        showAppBar={!!showAppBar}
        isPdfRequested={isPdfRequested}
      />
    );
  }
  return <div>Not found</div>;
};
