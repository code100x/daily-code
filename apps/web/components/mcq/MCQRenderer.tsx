"use client";
import { Problem, Track } from "@prisma/client";
import { BlogAppbar } from "../BlogAppbar";
import MCQQuestionCard from "./MCQCard";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@repo/ui";
import MCQPanel from "./MCQPanel";

const MCQRenderer = ({
  problem,
  track,
  showAppBar,
  problemIndex,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  showAppBar?: Boolean;
  problemIndex: number;
}) => {
  const { data, status } = useSession();
  const user = data?.user;

  if (status === "loading") {
    return <Loader className="animate-spin mx-auto my-40" size={64} />;
  }

  return (
    <div>
      {showAppBar && <BlogAppbar problem={problem} track={track} problemIndex={problemIndex} />}
      <div className="">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="" defaultSize={60}>
            <MCQPanel problem={problem} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <div className="h-[89vh] p-2 rounded-lg overflow-y-auto">
              <MCQQuestionCard problem={problem} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default MCQRenderer;
