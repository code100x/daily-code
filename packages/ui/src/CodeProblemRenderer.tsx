"use client";
import { NotionRenderer } from "./NotionRenderer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./shad/ui/resizable";
import { ScrollArea, ScrollBar } from "./shad/ui/scroll-area";
import { CodeEditor } from "./CodeEditor";
import { RunCodeOutput } from "./RunCodeOutput";
import { ProblemAppbar } from "./ProblemAppbar";
import useMountStatus from "./hooks/useMountStatus";
import { useRef, useState } from "react";
import { Problem, Track } from "@prisma/client";

export const CodeProblemRenderer = ({
  problem,
  track,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
}) => {
  const mounted = useMountStatus();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const editorRef = useRef();

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <ProblemAppbar
        problem={problem}
        track={track}
        editorRef={editorRef}
        setError={setIsError}
        setLoading={setIsLoading}
        setOutput={setOutput}
        lanugage={language}
      />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <ScrollArea className="h-screen p-2 rounded-lg w-50">
            <NotionRenderer recordMap={problem.notionRecordMap} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={80}>
              <ScrollArea className="h-screen p-2 rounded-lg">
                <CodeEditor editorRef={editorRef} setLanguage={setLanguage} language={language} />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20}>
              <ScrollArea className="h-screen">
                <RunCodeOutput error={isError} output={output} />
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
