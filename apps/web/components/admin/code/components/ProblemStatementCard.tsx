"use client";
import { ProblemStatement, CodeLanguage, ProblemType } from "@prisma/client";
import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import MultipleOptionChip from "../../../MultipleOptionChip";
import ProblemStatementForm from "../ProblemStatementForm";
interface Problem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  notionDocId: string;
}

export default function ProblemStatementCard({
  problemStatement,
}: {
  problemStatement: ProblemStatement & { languagesSupported: CodeLanguage[] } & { problem: Problem };
}) {
  return (
    <>
      <Card key={problemStatement.id}>
        <div className="grid grid-cols-6">
          <div className="col-span-6">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{problemStatement.problemId}</CardTitle>
                <ProblemStatementForm problemStatement={problemStatement} isNew={false} />
              </div>
              <CardDescription>MainFunction: {problemStatement.mainFuncName}()</CardDescription>
              <CardDescription>
                Languages:
                {problemStatement.languagesSupported.map((languagesSupported: CodeLanguage) => {
                  return <MultipleOptionChip key={languagesSupported.id} value={languagesSupported.value} />;
                })}
                Arguments:
                {problemStatement.argumentNames.map((argumentNames: string) => {
                  return <MultipleOptionChip key={argumentNames} value={argumentNames} />;
                })}
              </CardDescription>
              <CardDescription>
                Problem Link:{" "}
                <a href={`https://notion.so/${problemStatement.problem.notionDocId}`}>
                  {problemStatement.problem.notionDocId}
                </a>
              </CardDescription>
            </CardHeader>
          </div>
        </div>
      </Card>
    </>
  );
}
