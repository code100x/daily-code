import { NotionRenderer } from "../NotionRenderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { History, LoaderCircle, NotepadText, FlaskConical } from "lucide-react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  activeSubmissionIdState,
  activeSubmissionResultSelector,
  activeTabState,
  fetchSubmissionsLoadingState,
  problemStatementIdState,
  showSolutionDetailState,
  solutionsState,
  submissionResultState,
} from "@repo/store";
import SubmissionDetail from "../submission/SubmissionDetail";
import SubmissionList from "../submission/SubmissionList";
import { Submission, CodeLanguage, ProblemStatement } from "@prisma/client";
import { useEffect, useState } from "react";
import { SolutionList } from "../solution/SolutionList";
import { SolutionDetail } from "../solution/SolutionDetail";

const ProblemStatementPanel = ({
  notionRecordMap,
  submissions,
  problemStatement
}: {
  notionRecordMap: any;
  submissions: (Submission & { language: CodeLanguage })[] | null;
  problemStatement: ProblemStatement
}) => {
  const [fetchSubmissionsLoading, setFetchSubmissionsLoading] = useRecoilState(fetchSubmissionsLoadingState);
  const activeSubmissionResult = useRecoilValue(activeSubmissionResultSelector);
  const activeSubmissionId = useRecoilValue(activeSubmissionIdState);
  const setSubmissionResult = useSetRecoilState(submissionResultState);
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);
  const setProblemStatementId = useSetRecoilState(problemStatementIdState);
  const [solutions, setSolutions] = useRecoilState(solutionsState);
  const showSolutionDetail = useRecoilValue(showSolutionDetailState);

  useEffect(() => {
    if (problemStatement) {
      setProblemStatementId(problemStatement.id);
    }
  }, []);
  
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

  useEffect(() => {
    async function getSolutions() {
      const res = await fetch(`/api/solution?problemStatementId=${problemStatement.id}`);
      if (res.status == 200) {
        const data = await res.json();
        console.log(data)
        setSolutions(data.solutions);
      }
    }
    getSolutions();
  }, []);

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
          <TabsTrigger value="solutions" className="w-full px-4">
            <FlaskConical className="mr-2 text-[#195698]" size={16} />
            Solutions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <NotionRenderer recordMap={notionRecordMap} />
        </TabsContent>
        <TabsContent value="submissions">
          {activeSubmissionId ? <SubmissionDetail /> : <SubmissionList submissions={submissions} />}
        </TabsContent>
        <TabsContent value="solutions">
          {showSolutionDetail ? <SolutionDetail /> : <SolutionList />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProblemStatementPanel;
