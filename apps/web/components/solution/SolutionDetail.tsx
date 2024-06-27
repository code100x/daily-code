import { Button } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { showSolutionDetailState, solutionDetailState } from "@repo/store";

export function SolutionDetail() {
  const setShowSolutionDetailState = useSetRecoilState(showSolutionDetailState);
  const solutionDetail = useRecoilValue(solutionDetailState);

  return (
    <div>
      <Button variant="ghost" onClick={() => setShowSolutionDetailState(false)}>
        <ArrowLeft size={16} className="mr-2" /> All Solutions{" "}
      </Button>
    </div>
  )
}
