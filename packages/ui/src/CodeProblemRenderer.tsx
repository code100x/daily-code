"use client";
import { NotionRenderer } from "./NotionRenderer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./shad/ui/resizable";
import { ScrollArea } from "./shad/ui/scroll-area";
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

  const question = {
    id: 1,
    title: "Find the sum of two numbers",
    description: "Write a function that takes two numbers as arguments and returns their sum.",
    codeSnippet: "function sum(a, b) {\n return a + b;\n}",
  };

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
      />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <ScrollArea className="h-screen p-2 rounded-lg">
            {/* <NotionRenderer recordMap={problem.notionRecordMap} /> */}
            <div>
              <div>{question.title}</div>
              <div>{question.description}</div>
              <div>{question.codeSnippet}</div>
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={80}>
              <ScrollArea className="h-screen p-2 rounded-lg">
                <CodeEditor editorRef={editorRef} />
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
