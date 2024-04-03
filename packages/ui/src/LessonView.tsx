import { Blog } from "./Blog";
import { CodeProblemRenderer } from "./CodeProblemRenderer";
import { Problem, Track, MCQQuestion } from "@prisma/client";
import { MCQ } from "./mcq/MCQ";

export const LessonView = ({
  problem,
  track,
  showAppBar,
  isPdfRequested,
}: {
  problem: Problem & { notionRecordMap: any } & { mcqQuestions: MCQQuestion[] | null };
  track: Track & { problems: Problem[] };
  showAppBar?: Boolean;
  isPdfRequested?: Boolean;
}) => {
  switch (problem.type) {
    case "Code":
      return <CodeProblemRenderer track={track} problem={problem} />;
    case "Blog":
      return <Blog problem={problem} track={track} showAppBar={!!showAppBar} isPdfRequested={isPdfRequested} />;
    case "MCQ":
      problem.mcqQuestions = problem.mcqQuestions || null;
      if (problem.mcqQuestions && problem.mcqQuestions.length > 0 && !isPdfRequested) {
        return <MCQ problem={problem} mcqQuestions={problem.mcqQuestions} track={track} showAppBar={!!showAppBar} />;
      } else {
        return <Blog problem={problem} track={track} showAppBar={!!showAppBar} isPdfRequested={isPdfRequested} />;
      }
    default:
      return <div>Not found</div>;
  }
};
