import { TooltipContent } from "@radix-ui/react-tooltip";
import { Button } from "./shad/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./shad/ui/tooltip";
import { Problem, Track } from "@repo/store";
import { executeCode } from "@repo/common";

export const ProblemAppbar = ({
  problem,
  track,
  editorRef,
  setOutput,
  setLoading,
  setError,
}: {
  problem: Problem;
  track: Track;
  editorRef: any;
  setLoading: any;
  setError: any;
  setOutput: any;
}) => {
  const problemIndex = track.problems.findIndex((p) => p === problem.id);
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
                <Button variant="outline">Next {">"}</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Lesson</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">{"<"} Prev </Button>
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
