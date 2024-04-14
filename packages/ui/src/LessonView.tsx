import { Blog } from "./Blog";
import { CodeProblemRenderer } from "./CodeProblemRenderer";
import { Problem, Track } from "@prisma/client";
import MCQQuestionRenderer from "./MCQQuestionRenderer";

export const LessonView = ({
  problem,
  track,
  showAppBar,
  isPdfRequested,
  allTracks,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar?: Boolean;
  isPdfRequested?: Boolean;
  allTracks: Track[] & { problems: Problem[] };
}) => {
  if (problem.type === "MCQ") {
    return <MCQQuestionRenderer problem={problem} track={track} showAppBar={!!showAppBar} allTracks={allTracks} />;
  }
  if (problem.type === "Code") {
    return <CodeProblemRenderer track={track} problem={problem} />;
  }

  if (problem.type === "Blog") {
    return (
      <Blog
        problem={problem}
        track={track}
        showAppBar={!!showAppBar}
        isPdfRequested={isPdfRequested}
        allTracks={allTracks}
      />
    );
  }
  return <div>Not found</div>;
};
