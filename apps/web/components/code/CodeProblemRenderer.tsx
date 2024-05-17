"use client";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@repo/ui";
import { ScrollArea } from "@repo/ui";
import { CodeEditor } from "./CodeEditor";
import { RunCodeOutput } from "./RunCodeOutput";
import { Problem, Track, Submission, CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";
import { BlogAppbar } from "../BlogAppbar";
import { useSession } from "next-auth/react";
import ProblemStatementPanel from "./ProblemStatementPanel";
import { Loader } from "lucide-react";

export const CodeProblemRenderer = ({
  problem,
  track,
  submissions,
  problemIndex
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
  submissions: (Submission & { language: CodeLanguage })[] | null;
  problemIndex: number
}) => {
  const { data, status } = useSession();
  const user = data?.user;

  if (problem.problemStatement) {
    return (
      <div>
        <BlogAppbar problem={problem} track={track} problemIndex={problemIndex}/>
        {status === "loading" ? (
          <Loader className="animate-spin mx-auto my-40" size={64} />
        ) : (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50}>
              <ProblemStatementPanel notionRecordMap={problem.notionRecordMap} submissions={submissions} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={60}>
                  <ScrollArea className="h-full p-2 rounded-lg">
                    <CodeEditor problemStatement={problem.problemStatement} />
                  </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40}>
                  <ScrollArea className="h-full overflow-y-auto">
                    <RunCodeOutput problemStatement={problem.problemStatement} />
                  </ScrollArea>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    );
  }
};
