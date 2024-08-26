import { useState } from "react";
import { NotionRenderer } from "../NotionRenderer";
import { Problem } from "@prisma/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { History, NotepadText } from "lucide-react";
import SubmissionMCQ from "./SubmissionMCQ";

const MCQPanel = ({ problem }: { problem: Problem & { notionRecordMap: any } }) => {
  const [activeTab, setActiveTab] = useState("description");
  return (
    <div className="h-[calc(100vh-72px)] overflow-y-scroll">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="p-4">
        <TabsList className="">
          <TabsTrigger value="description" className="w-full px-4">
            <NotepadText className="mr-2 text-[#195698]" size={16} />
            Description
          </TabsTrigger>
          <TabsTrigger value="submissions" className="w-full px-4">
            <History className="mr-2 text-[#195698]" size={16} />
            Submissions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="">
          <NotionRenderer recordMap={problem.notionRecordMap} />
        </TabsContent>
        <TabsContent value="submissions" className="">
          <SubmissionMCQ problem={problem} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MCQPanel;
 