import { Blog } from "./Blog";
import { Problem, Track, ProblemStatement, CodeLanguage, TestCase } from "@prisma/client";
import MCQRenderer from "./mcq/MCQRenderer";
import RedirectToLoginCard from "./RedirectToLoginCard";

import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { CodeProblemRenderer } from "./code/CodeProblemRenderer";
import { AppbarClient } from "./AppbarClient";

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
  const session = await getServerSession(authOptions);

  const problemIndex = track.problems.findIndex((p) => p.id === problem.id);

  if (problemIndex > 1 && (!session || !session.user)) {
    return <div> 
      <AppbarClient />
      <RedirectToLoginCard />
    </div>; 
  }

  if (problem.type === "MCQ") {
    return <MCQRenderer problem={problem} track={track} showAppBar={!!showAppBar} problemIndex={problemIndex} />;
  }
  if (problem.type === "Code" && problem.problemStatement) {
    const submissions = await getSubmissions(problem.problemStatement.id);
    return (
      <CodeProblemRenderer track={track} problem={problem} submissions={submissions} problemIndex={problemIndex} />
    );
  }

  if (problem.type === "Blog") {
    return (
      <Blog
        problem={problem}
        track={track}
        showAppBar={!!showAppBar}
        isPdfRequested={isPdfRequested}
        problemIndex={problemIndex}
      />
    );
  }
  return <div>Not found</div>;
};
