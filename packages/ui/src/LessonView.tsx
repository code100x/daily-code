import { Blog } from "./Blog";
import { CodeProblemRenderer } from "./code/CodeProblemRenderer";
import { Problem, Track, ProblemStatement, CodeLanguage, TestCase } from "@prisma/client";
import MCQQuestionRenderer from "./MCQQuestionRenderer";
import db from "@repo/db/client";
const getSubmissions = async (problemStatementId: string) => {
  const submissions = await db.submission.findMany({
    where: {
      problemStatementId,
    },
    include: {
      language: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return submissions;
};

export const LessonView = async ({
  problem,
  track,
  showAppBar,
  isPdfRequested,
}: {
  problem: Problem & { notionRecordMap: any } & {
    problemStatement:
      | (ProblemStatement & {
          languagesSupported: CodeLanguage[];
          testCases: TestCase[];
        })
      | null;
  };
  track: Track & { problems: Problem[] };
  showAppBar?: Boolean;
  isPdfRequested?: Boolean;
}) => {
  if (problem.type === "MCQ") {
    return <MCQQuestionRenderer problem={problem} track={track} showAppBar={!!showAppBar} />;
  }
  if (problem.type === "Code" && problem.problemStatement) {
    const submissions = await getSubmissions(problem.problemStatement.id);
    return <CodeProblemRenderer track={track} problem={problem} submissions={submissions} />;
  }

  if (problem.type === "Blog") {
    return <Blog problem={problem} track={track} showAppBar={!!showAppBar} isPdfRequested={isPdfRequested} />;
  }
  return <div>Not found</div>;
};
