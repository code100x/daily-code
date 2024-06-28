import { Button } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { currentSolutionIdState , solutionDetailState, solutionLoadingState } from "@repo/store";
import { useEffect } from "react";
import { UserDetail } from "../UserDetail";

export function SolutionDetail() {
  const [currentSolutionId, setCurrentSolutionId] = useRecoilState(currentSolutionIdState);
  const [solutionDetail, setSolutionDetail] = useRecoilState(solutionDetailState);
  const setSolutionLoading = useSetRecoilState(solutionLoadingState);

  useEffect(() => {

    async function fetchSolution() {
      if (!solutionDetail[currentSolutionId]) {
        const res = await fetch(`/api/solution/${currentSolutionId}`);
        if (res.status == 200) {
          const data = await res.json();
          console.log(data)
          setSolutionDetail((prev: any) => ({...prev, [currentSolutionId]: data.solution}));
          setSolutionLoading(false);
        }
      } else {
        setSolutionLoading(false);
      }
    }
    fetchSolution();
  }, [currentSolutionId])

  return (
    <div>
      {currentSolutionId ? (
        <div>
          <Button variant="ghost" onClick={() => setCurrentSolutionId(null)}>
            <ArrowLeft size={16} className="mr-2" /> All Solutions{" "}
          </Button>
          <div className="flex flex-col gap-4 px-2 py-1">
            {solutionDetail[currentSolutionId]?.title}
            <UserDetail solution={solutionDetail}/>
          </div>
        </div>
      ) : (
        <div> 
            
        </div>
      )}
      
    </div>
  )
}
