import { TooltipContent } from "@radix-ui/react-tooltip";
import { Button } from "./shad/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./shad/ui/tooltip";
import { Problem } from "@repo/store";

export const ProblemAppbar = ({problem}: {problem: Problem}) => {
    return <div className="mt-2 ml-2 mr-2 flex justify-between">
        <div className="flex-1">
            {problem.title}
        </div>
        <div className="flex justify-center content-center flex-1">
            <Button variant={"secondary"} size={"sm"} className="mr-2">
                Run Code
            </Button>
            <Button  variant={"secondary"} size={"sm"} className="ml-2 text-green-500">
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
}