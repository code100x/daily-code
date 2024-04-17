"use client";
import { ScrollArea } from "../../shad/ui/scroll-area";
import ProblemStatementCard from "./components/ProblemStatementCard";
import { problemStatementsAtom } from "@repo/store";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { getAllProblemStatements } from "web/components/utils";

export const refetch = async () => {
  const problemStatements = await getAllProblemStatements();
  return problemStatements;
};

export const ProblemStatements = () => {
  const [problemStatements, setProblemStatements] = useRecoilState(problemStatementsAtom);
  useEffect(() => {
    const getAndSetLang = async () => {
      const newProblemStatements = await refetch();
      setProblemStatements(newProblemStatements);
    };
    getAndSetLang();
  }, []);
  return (
    <div className="grid grid-cols-1 place-items-center">
      <ScrollArea className="m-2 w-2/3">
        <div className="space-y-4">
          {problemStatements.map((problemStatement, i) => {
            return <ProblemStatementCard key={i} problemStatement={problemStatement} />;
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
