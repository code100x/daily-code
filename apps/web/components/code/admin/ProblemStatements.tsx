"use client";
import { ScrollArea } from "@repo/ui";
import ProblemStatementCard from "./components/ProblemStatementCard";
import { problemStatementsAtom } from "@repo/store";
import { useRecoilState } from "recoil";
import { Dispatch, SetStateAction, useEffect } from "react";
import { getAllProblemStatements } from "../../utils";
import { ProblemStatement } from "prisma/prisma-client";
import NewProblemStatement from "./components/NewProblemStatement";

export const refetch = async () => {
  const problemStatements: ProblemStatement[] = await getAllProblemStatements();
  return problemStatements;
};

export const ProblemStatements = () => {
  const [problemStatements, setProblemStatements]: [ProblemStatement[], Dispatch<SetStateAction<ProblemStatement[]>>] =
    useRecoilState(problemStatementsAtom);
  useEffect(() => {
    const getAndSetLang = async () => {
      const newProblemStatements = await refetch();
      setProblemStatements(newProblemStatements);
    };
    getAndSetLang();
  }, []);

  return (
    <div className="grid grid-cols-1 place-items-center">
      <NewProblemStatement />
      <ScrollArea className="m-2 w-2/3">
        <div className="space-y-4">
          {problemStatements.map((problemStatement, i) => {
            return (
              <ProblemStatementCard
                key={i}
                problemStatement={{
                  ...problemStatement,
                  languagesSupported: [],
                  problem: { description: "", id: "", notionDocId: "", title: "", type: "Code" },
                }}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
