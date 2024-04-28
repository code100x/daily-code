"use client";
import { Problem, Track } from "@prisma/client";
import { ScrollArea } from "../shad/ui/scroll-area";
import { NotionRenderer } from "../NotionRenderer";
import { BlogAppbar } from "../BlogAppbar";
import MCQQuestionCard from "./MCQQuestionCard";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../shad/ui/resizable";

const MCQQuestionRenderer = ({
  problem,
  track,
  showAppBar,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar?: Boolean;
}) => {
  const { data, status } = useSession();
  const user = data?.user;
  
  if (status === "loading") {
    return <Loader className="animate-spin mx-auto my-40" size={64} />;
  }

  return (
    <div>
      {showAppBar && <BlogAppbar problem={problem} track={track} />}
      <div className="">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="" defaultSize={60}>
          <div className="h-screen p-2 overflow-y-auto">
            <NotionRenderer recordMap={problem.notionRecordMap}/>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
        <ScrollArea className="h-screen p-2 rounded-lg">
          <MCQQuestionCard problem={problem} />
        </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default MCQQuestionRenderer;