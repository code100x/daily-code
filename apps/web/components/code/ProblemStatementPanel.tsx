import { NotionRenderer } from "../NotionRenderer";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { History, LoaderCircle, NotepadText } from "lucide-react";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  activeSubmissionIdState,
  activeSubmissionResultSelector,
  activeTabState,
  fetchSubmissionsLoadingState,
  submissionResultState,
} from "@repo/store";
import SubmissionDetail from "../submission/SubmissionDetail";
import SubmissionList from "../submission/SubmissionList";
import { Submission, CodeLanguage } from "@prisma/client";
import { useEffect } from "react";

const ProblemStatementPanel = ({
  notionRecordMap,
  submissions,
}: {
  notionRecordMap: any;
  submissions: (Submission & { language: CodeLanguage })[] | null;
}) => {
  const [fetchSubmissionsLoading, setFetchSubmissionsLoading] = useRecoilState(fetchSubmissionsLoadingState);

  const activeSubmissionResult = useRecoilValue(activeSubmissionResultSelector);

  const activeSubmissionId = useRecoilValue(activeSubmissionIdState);
  const setSubmissionResult = useSetRecoilState(submissionResultState);

  const [activeTab, setActiveTab] = useRecoilState(activeTabState);

  useEffect(() => {
    (async () => {
      if (fetchSubmissionsLoading && activeSubmissionId) {
        if (!activeSubmissionResult) {
          try {
            const res = await fetch(`/api/code/submission/${activeSubmissionId}`);
            const data = await res.json();
            setSubmissionResult((prev: any) => ({ ...prev, [activeSubmissionId]: data }));
          } catch (err: any) {
            console.log("Error", err.message);
          } finally {
            setFetchSubmissionsLoading(false);
          }
        } else {
          setFetchSubmissionsLoading(false);
        }
      }
    })();
  }, [fetchSubmissionsLoading, activeSubmissionId]);

  return (
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
          <NotionRenderer recordMap={notionRecordMap} />
        </TabsContent>
        <TabsContent value="submissions" className="">
          {activeSubmissionId ? <SubmissionDetail /> : <SubmissionList submissions={submissions} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProblemStatementPanel;
