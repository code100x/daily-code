import { useRecoilValue, useSetRecoilState } from "recoil";
import { showSolutionDetailState, solutionDetailState, solutionsState } from "@repo/store";
import { Button } from "@repo/ui";
import { SquarePen } from "lucide-react";
import { Solution } from "./Solution";

export const SolutionList = () => {
  const solutions = useRecoilValue(solutionsState);
  const setSolutionDetail = useSetRecoilState(solutionDetailState);
  const setShowSolutionDetailState = useSetRecoilState(showSolutionDetailState);
  console.log(solutions);

  const handleSolutionClick = async (solution: any) => {
    const res = await fetch(`/api/solution/${solution.id}`);
    const data = await res.json();
    setSolutionDetail(data);
    setShowSolutionDetailState(true);
  };

  return (
    <div>
      <div className="flex justify-end">
        <Button className="bg-[rgb(14,120,42)] text-white hover:bg-[#24572e]">
          <div className="flex gap-2 items-center">
            <SquarePen size={16} /> Share my solution
          </div>
        </Button>
      </div>
      {solutions ? (
        <div>
          {solutions.map((sol, idx) => {
            return <div key={sol.id}>
              <Solution solution={sol} onClick={() => handleSolutionClick(sol)}/>
            </div>;
          })}
        </div>
      ) : (
        <div>No solutions Yet!</div>
      )}
    </div>
  );
};
