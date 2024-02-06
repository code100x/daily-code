import React, { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";
import { Button } from "./shad/ui/button";
import { Problem } from "@repo/store";
import { useRouter } from "next/navigation";
import { getFunction } from "@repo/common";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

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
      // Check if props.allProblemIds is defined
      if (props.allProblemIds) {
        const titles = await Promise.all(
          props.allProblemIds.map(async (problemId) => {
            const problemDetails = await getProblem(problemId);
            return { id: problemId, title: problemDetails?.title || "" };
          })
        );
        setAllProblemTitles(titles);
      }
    };

    fetchProblemTitles();
  }, [props.allProblemIds]);
  // Run the effect whenever allProblemIds changes

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {" "}
          <span className="line-clamp-2 text-nowrap max-w-[70vw] pr-2">{`${props.title}`}</span>-{" "}
          <span className="pl-2">{` (${props.currentIndex})`}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className=" max-h-96 lg:max-h-[70vh] max-w-[80vw]  overflow-y-auto scroll-smooth webkit-scrollbar"
        align="center"
      >
        {allProblemTitles.map((problem: { id: string; title: string }, index: number) => (
          <DropdownMenuItem
            className="line-clamp-3  "
            key={index}
            onClick={() => router.push(`/tracks/${props.track.id}/${problem.id}`)}
          >
            {index + 1} - {problem.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
