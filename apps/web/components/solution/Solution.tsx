import { useSetRecoilState } from "recoil";
import SubmissionCreatedAt from "../submission/SubmissionCreatedAt";
import { showSolutionDetailState } from "@repo/store";

export function Solution({ solution, onClick  }: { solution: any,  onClick: () => void }) {
  const setShowSolutionDetailState = useSetRecoilState(showSolutionDetailState);

  return (
    <div className="border-b-2 p-2 cursor-pointer" onClick={onClick}>
      <div className="flex gap-4">  
        <Avatar />
        <div className="flex flex-col">
          <div className="text-xs text-slate-500 flex">
            <div className="mt-2">
              {solution.user.name}
              <span className="px-2">&middot;</span>
            </div>
            <SubmissionCreatedAt createdAt={solution.createdAt} />
          </div>
          <div>{solution.title}</div>
        </div>
      </div>
      <div className="inline-block rounded-2xl bg-gray-500 text-xs h-4 px-2 text-center ml-12">
        {solution.language.label}
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mt-3">
      <svg
        className="absolute w-10 h-10 text-gray-400 -left-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
      </svg>
    </div>
  );
}
