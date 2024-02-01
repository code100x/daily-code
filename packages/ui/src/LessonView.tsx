import { Blog } from "./Blog";
import { CodeProblemRenderer } from "./CodeProblemRenderer";
import { Track, Problem } from "@repo/store";

export const LessonView = ({ problem, track }: { problem: Problem; track: Track }) => {
  if (problem.type === "code") {
    return <CodeProblemRenderer track={track} problem={problem} />;
  }

  if (problem.type === "blog") {
    return <Blog problem={problem} track={track} />;
  }
  return <div>Not found</div>;
};
