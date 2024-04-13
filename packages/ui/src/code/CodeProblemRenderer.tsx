"use client";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../shad/ui/resizable";
import { ScrollArea } from "../shad/ui/scroll-area";
import { CodeEditor } from "./CodeEditor";
import { RunCodeOutput } from "./RunCodeOutput";
import { Problem, Track, Submission, CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";
import { BlogAppbar } from "../BlogAppbar";
import { useSession } from "next-auth/react";
import ProblemStatementPanel from "./ProblemStatementPanel";
import RedirectToLoginCard from "../RedirectToLoginCard";
import { Loader } from "lucide-react";

export const CodeProblemRenderer = ({
  problem,
  track,
  submissions,
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
}) => {
  const { data, status } = useSession();
  const user = data?.user;

  if (problem.problemStatement) {
    return (
      <div>
        <BlogAppbar problem={problem} track={track} />
        {status === "loading" ? (
          <Loader className="animate-spin mx-auto my-40" size={64} />
        ) : user ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50}>
              <ProblemStatementPanel notionRecordMap={problem.notionRecordMap} submissions={submissions} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={60} className="">
                  <ScrollArea className="h-full p-2 rounded-lg">
                    <CodeEditor problemStatement={problem.problemStatement} />
                  </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} className="">
                  <ScrollArea className="h-full overflow-y-auto">
                    <RunCodeOutput problemStatement={problem.problemStatement} />
                  </ScrollArea>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <RedirectToLoginCard />
        )}
      </div>
    );
  }
};
