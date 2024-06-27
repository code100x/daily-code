import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import db from "@repo/db/client";

import { redirect } from "next/navigation";
import ProblemSubmissionTable from "../../../components/ProblemSubmissionTable";
import { Braces } from "lucide-react";
import { ProfileStats } from "../../../components/ProfileStats";

export default async function Solutions() {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user) {
    redirect("/");
  }

  const getAllSolutions = async () => {
    if (!session || !session.user) {
      return null;
    }

    const userId = session.user.id;
    const solutions = await db.solution.findMany({
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
    return solutions;
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
        solutions: true,
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

  const solutions = await getAllSolutions();
  const problemStatementIds: string[] | undefined = solutions?.map((solution) => solution.problemStatementId);
  const problemStatements = await fetchProblemStatements(problemStatementIds);

  return (
    <>
      <ProfileStats problemStatements={problemStatements} stat={"Solutions"}/>
    </>
  );
}
