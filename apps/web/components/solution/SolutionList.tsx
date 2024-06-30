import { useRecoilValue } from "recoil";
import { solutionsState } from "@repo/store";
import { Solution } from "./Solution";

export const SolutionList = () => {
  const solutions = useRecoilValue(solutionsState);

  return (
    <div>
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
