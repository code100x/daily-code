"use client";
import { NotionRenderer } from "./NotionRenderer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./shad/ui/resizable";
import { ScrollArea } from "./shad/ui/scroll-area";
import { CodeEditor } from "./CodeEditor";
import { RunCodeOutput } from "./RunCodeOutput";
import useMountStatus from "./hooks/useMountStatus";
import { Problem, Track, Submission, CodeLanguage } from "@prisma/client";
import { BlogAppbar } from "./BlogAppbar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./shad/ui/tabs";
import { History, LoaderCircle, NotepadText } from "lucide-react";

import { useRecoilValue, useRecoilState } from "recoil";
import {
  activeSubmissionIdState,
  activeTabState,
  fetchSubmissionsLoadingState,
  submissionResultState,
} from "../../store/src/atoms";
import { useEffect } from "react";
import SubmissionDetail from "./SubmissionDetail";
import SubmissionList from "./SubmissionList";

export const CodeProblemRenderer = ({
  problem,
  track,
  submissions,
}: {
  problem: Problem & { notionRecordMap: any };
  track: Track & { problems: Problem[] };
  submissions: (Submission & { language: CodeLanguage })[];
}) => {
  const mounted = useMountStatus();
  const [fetchSubmissionsLoading, setFetchSubmissionsLoading] = useRecoilState(fetchSubmissionsLoadingState);

  const activeSubmissionId = useRecoilValue(activeSubmissionIdState);
  const [submissionResult, setSubmissionResult] = useRecoilState(submissionResultState);

  console.log("activeSubmissionId", activeSubmissionId);

  useEffect(() => {
    (async () => {
      if (fetchSubmissionsLoading && activeSubmissionId) {
        if (!submissionResult || !submissionResult[activeSubmissionId]) {
          try {
            const res = await fetch(`/api/code/submission/${activeSubmissionId}`);
            const data = await res.json();
            setSubmissionResult((prev: any) => ({ ...prev, [activeSubmissionId]: data }));
          } catch (err: any) {
            console.log("aefseafsef", err.message);
          } finally {
            setFetchSubmissionsLoading(false);
          }
        } else {
          setFetchSubmissionsLoading(false);
        }
      }
    })();
  }, [fetchSubmissionsLoading, activeSubmissionId]);

  const [activeTab, setActiveTab] = useRecoilState(activeTabState);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <BlogAppbar problem={problem} track={track} />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div className="h-[calc(100vh-72px)] overflow-y-scroll">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="p-4">
              <TabsList className="">
                <TabsTrigger value="description" className="w-full px-4">
                  <NotepadText className="mr-2 text-[#195698]" size={16} />
                  Description
                </TabsTrigger>
                <TabsTrigger value="submissions" className="w-full px-4">
                  {fetchSubmissionsLoading ? (
                    <LoaderCircle className="animate-spin mr-2" size={16} />
                  ) : (
                    <History className="mr-2 text-[#195698]" size={16} />
                  )}
                  Submissions
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="">
                <NotionRenderer recordMap={problem.notionRecordMap} />
              </TabsContent>
              <TabsContent value="submissions" className="">
                {activeSubmissionId ? <SubmissionDetail /> : <SubmissionList submissions={submissions} />}
              </TabsContent>
            </Tabs>
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
