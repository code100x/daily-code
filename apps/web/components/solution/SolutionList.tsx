import { useRecoilValue } from "recoil";
import { solutionsState } from "@repo/store";
import { Button } from "@repo/ui";
import { SquarePen } from "lucide-react";
import { Solution } from "./Solution";

export const SolutionList = () => {
  const solutions = useRecoilValue(solutionsState);
  console.log(solutions);

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
          {solutions.map((sol) => {
            return <div key={sol.id}>
              <Solution solution={sol}/>
            </div>;
          })}
        </div>
      ) : (
        <div>No solutions Yet!</div>
      )}
    </div>
  );
};
