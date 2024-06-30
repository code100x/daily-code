import { Button, ScrollArea } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentSolutionIdState, solutionDetailState, solutionLoadingState } from "@repo/store";
import { useEffect } from "react";
import { UserDetail } from "../UserDetail";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Editor } from "@monaco-editor/react";

export function SolutionDetail() {
  const [currentSolutionId, setCurrentSolutionId] = useRecoilState(currentSolutionIdState);
  const [solutionDetail, setSolutionDetail] = useRecoilState(solutionDetailState);
  const setSolutionLoading = useSetRecoilState(solutionLoadingState);

  useEffect(() => {
    async function fetchSolution() {
      if (!solutionDetail[currentSolutionId] && currentSolutionId) {
        const res = await fetch(`/api/solution/${currentSolutionId}`);
        if (res.status == 200) {
          const data = await res.json();
          console.log(data);
          setSolutionDetail((prev: any) => ({ ...prev, [currentSolutionId]: data.solution }));
          setSolutionLoading(false);
        }
      } else {
        setSolutionLoading(false);
      }
    }
    fetchSolution();
  }, [currentSolutionId]);

  const currentSolutionDetail = solutionDetail[currentSolutionId];

  return (
    <div>
      {currentSolutionId && currentSolutionDetail ? (
        <div>
          <Button variant="ghost" onClick={() => setCurrentSolutionId(null)}>
            <ArrowLeft size={16} className="mr-2" /> All Solutions{" "}
          </Button>
          <div className="flex flex-col gap-2 px-2 py-1">
            <span className="text-xl font-semibold">{currentSolutionDetail?.title}</span>
            <UserDetail solution={currentSolutionDetail} />
            <Markdown remarkPlugins={[remarkGfm]}>{currentSolutionDetail.explanation}</Markdown>
            <div>
              <div className="font-semibold text-xl pt-4">Code | {currentSolutionDetail.language.label}</div>
              <ScrollArea className="rounded-md mt-3">
                <Editor
                  height={"40vh"}
                  value={atob(currentSolutionDetail.code)}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    lineNumbers: "off",
                    readOnly: true,
                    scrollBeyondLastLine: false,
                  }}
                  language={currentSolutionDetail.language.value}
                />
              </ScrollArea>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
