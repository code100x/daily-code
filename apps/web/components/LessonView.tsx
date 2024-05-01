import { Blog } from "../../../packages/ui/src/Blog";
import { CodeProblemRenderer } from "../../../packages/ui/src/code/CodeProblemRenderer";
import { Problem, Track, ProblemStatement, CodeLanguage, TestCase } from "@prisma/client";
import MCQRenderer from "../../../packages/ui/src/mcq/MCQRenderer";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

const getSubmissions = async (problemStatementId: string) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null;
  }

  const userId = session.user.id;
  const submissions = await db.submission.findMany({
    where: {
      problemStatementId,
      userId,
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
    return <MCQRenderer problem={problem} track={track} showAppBar={!!showAppBar} />;
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
