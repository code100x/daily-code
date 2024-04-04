import { TooltipContent } from "@radix-ui/react-tooltip";
import { Button } from "./shad/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./shad/ui/tooltip";
import { Problem, Track } from "@prisma/client";
import { executeCode } from "@repo/common";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface ProblemAppbarProps {
  problem: Problem;
  track: Track & { problems: Problem[] };
  editorRef: MutableRefObject<any>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<boolean>>;
  setOutput: Dispatch<SetStateAction<any>>;
}

export const ProblemAppbar = ({ problem, track, editorRef, setOutput, setLoading, setError }: ProblemAppbarProps) => {
  const problemIndex = track.problems.findIndex((p) => p.id === problem.id);
  return (
    <div className="mt-2 ml-2 mr-2 flex justify-between">
      <div className="flex-1 flex justify">
        {problem.title} {problemIndex + 1} / {track.problems.length}
      </div>
      <div className="flex justify-center content-center flex-1">
        <Button
          variant={"secondary"}
          size={"sm"}
          className="mr-2"
          onClick={async () => {
            const sourceCode = editorRef.current.getValue();
            if (!sourceCode) return;
            try {
              setLoading(true);
              const { run: result } = await executeCode(sourceCode);
              setOutput(result.output.split("\n"));
              result.stderr ? setError(true) : setError(false);
            } catch (error) {
              console.log(error);
            } finally {
              setLoading(false);
            }
          }}
        >
          Run Code
        </Button>
        <Button variant={"secondary"} size={"sm"} className="ml-2 text-green-500">
          Submit Code
        </Button>
      </div>
      <div className="flex flex-1 flex-row-reverse">
        <TooltipProvider>
          <div className="pr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  prefetch={true}
                  href={
                    problemIndex + 1 === track.problems.length
                      ? ``
                      : `/tracks/${track.id}/${track.problems[problemIndex + 1]!.id}`
                  }
                  style={{ cursor: problemIndex + 1 !== track.problems.length ? "pointer" : "not-allowed" }}
                >
                  <Button
                    variant="outline"
                    className="bg-black text-white"
                    disabled={problemIndex + 1 !== track.problems.length ? false : true}
                  >
                    Next
                    <div className="pl-2">
                      <ChevronRightIcon />
                    </div>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Lesson</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                prefetch={true}
                href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}` : ``}
                style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}
              >
                <Button
                  variant="outline"
                  className="ml-2 bg-black text-white"
                  disabled={problemIndex !== 0 ? false : true}
                >
                  <div className="pr-2">
                    <ChevronLeftIcon />
                  </div>
                  Prev
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Previous Lesson</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
