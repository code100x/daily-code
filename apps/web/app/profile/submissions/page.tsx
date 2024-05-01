import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import db from "@repo/db/client";

import { redirect } from "next/navigation";
import ProblemSubmissionTable from "../../../components/ProblemSubmissionTable";
import { Braces } from "lucide-react";

export default async function Submissions() {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user) {
    redirect("/");
  }

  const getAllSubmissions = async () => {
    if (!session || !session.user) {
      return null;
    }

    const userId = session.user.id;
    const submissions = await db.submission.findMany({
      where: {
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

  async function fetchProblemStatements(problemStatementIds: string[] | undefined) {
    const uniqueProblemStatementIds: string[] = [...new Set(problemStatementIds)];
    const fetchedProblemStatements = await db.problemStatement.findMany({
      where: {
        id: {
          in: uniqueProblemStatementIds,
        },
      },
      include: {
        submissions: true,
        problem: {
          select: {
            title: true,
            description: true,
            trackProblems: true,
          },
        },
      },
    });

    return fetchedProblemStatements;
  }

  const submissions = await getAllSubmissions();

  const acceptedSubmissions = submissions?.filter((submission) => submission.statusId <= 3);
  const problemStatementIds = acceptedSubmissions?.map((submission) => submission.problemStatementId);

  const problemStatements = await fetchProblemStatements(problemStatementIds);

  return (
    <>
      <header className="border-b-2 p-3">
        <div className="px-2 w-[70%]">
          <h1 className="text-lg lg:text-2xl flex items-center gap-2 font-semibold w-fit">
            <Braces color="#3b82f6" />
            <span>Submissions</span>
          </h1>
          <span className="text-xs leading-normal text-gray-400">
            This page shows you the accepted submission you have made so far
          </span>
        </div>
      </header>
      <ProblemSubmissionTable problemStatements={problemStatements} />
    </>
  );
}
