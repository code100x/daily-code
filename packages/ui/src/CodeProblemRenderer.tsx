"use client";
import { NotionRenderer } from "./NotionRenderer";
import { Problem } from "../../store/src/atoms";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./shad/ui/resizable";
import { ScrollArea } from "./shad/ui/scroll-area"
import { CodeEditor } from "./CodeEditor";
import { RunCodeOutput } from "./RunCodeOutput";
import { ProblemAppbar } from "./ProblemAppbar";

export const CodeProblemRenderer = ({ problem }: { problem: Problem }) => {
    return <div>
        <ProblemAppbar problem={problem} />
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
}