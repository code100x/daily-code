import { Blog } from "./Blog";
import { CodeProblemRenderer } from "./CodeProblemRenderer";
import { Problem, Track } from "@prisma/client";
import MCQQuestionRenderer from "./MCQQuestionRenderer";

export const LessonView = ({
  problem,
  track,
  showAppBar,
  isPdfRequested,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar?: Boolean;
  isPdfRequested?: Boolean;
}) => {
  if (problem.type === "MCQ") {
    return <MCQQuestionRenderer problem={problem} track={track} showAppBar={!!showAppBar} />;
  }
  if (problem.type === "Code") {
    return <CodeProblemRenderer track={track} problem={problem} />;
  }

  if (problem.type === "Blog") {
    return <Blog problem={problem} track={track} showAppBar={!!showAppBar} isPdfRequested={isPdfRequested} />;
  }
  return <div>Not found</div>;
};
