"use client";
import { NotionRenderer } from "./NotionRenderer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./shad/ui/resizable";
import { ScrollArea } from "./shad/ui/scroll-area";
import { CodeEditor } from "./CodeEditor";
import { RunCodeOutput } from "./RunCodeOutput";
import { ProblemAppbar } from "./ProblemAppbar";
import useMountStatus from "./hooks/useMountStatus";
import { Problem, Track } from "@prisma/client";

export const CodeProblemRenderer = ({
  problem,
  track,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
}) => {
  const mounted = useMountStatus();

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <ProblemAppbar problem={problem} track={track} />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <ScrollArea className="h-screen p-2 rounded-lg">
            <NotionRenderer recordMap={problem.notionRecordMap} />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={80}>
              <ScrollArea className="h-screen p-2 rounded-lg">
                <CodeEditor />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20}>
              <ScrollArea className="h-screen">
                <RunCodeOutput />
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
