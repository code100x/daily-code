"use client";
import { NotionRenderer } from "./NotionRenderer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./shad/ui/resizable";
import { ScrollArea } from "./shad/ui/scroll-area";
import { CodeEditor } from "./CodeEditor";
import { RunCodeOutput } from "./RunCodeOutput";
import { ProblemAppbar } from "./ProblemAppbar";
import useMountStatus from "./hooks/useMountStatus";
import { Problem, Track } from "@prisma/client";
import { BlogAppbar } from "./BlogAppbar";

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
      <BlogAppbar problem={problem} track={track} />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div className="h-[calc(100vh-72px)] overflow-y-scroll">
            <NotionRenderer recordMap={problem.notionRecordMap} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} className="">
              <ScrollArea className="h-full p-2 rounded-lg">
                <CodeEditor />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} className="">
              <ScrollArea className="h-full overflow-y-auto">
                <RunCodeOutput />
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
