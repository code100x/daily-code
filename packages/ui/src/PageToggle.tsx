import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { getFunction } from "@repo/common";
import { Problem } from "@repo/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./shad/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";

async function getProblem(problemId: string | null): Promise<Problem | null> {
  if (!problemId) {
    return null;
  }
  const getProblem = getFunction("getProblem");
  const response: any = await getProblem({ problemId });
  return response.data.problem;
}

export function PageToggle(props: any) {
  const router = useRouter();
  const [allProblemTitles, setAllProblemTitles] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const fetchProblemTitles = async () => {
      const titles = await Promise.all(
        props.allProblemIds.map(async (problemId: string) => {
          const problemDetails = await getProblem(problemId);
          return { id: problemId, title: problemDetails?.title || "" };
        })
      );
      setAllProblemTitles(titles);
    };

    fetchProblemTitles();
  }, [props.allProblemIds]); // Run the effect whenever allProblemIds changes

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Jump To
          <div className="pl-2">
            <ArrowTopRightIcon />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn("overflow-y-auto max-h-[80vh]")}>
        {allProblemTitles.map((problem: { id: string; title: string }, index: number) => (
          <DropdownMenuItem key={index} onClick={() => router.push(`/tracks/${props.track.id}/${problem.id}`)}>
            {index + 1} - {problem.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
