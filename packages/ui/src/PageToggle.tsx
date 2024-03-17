import React, { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";
import { Button } from "./shad/ui/button";
import { Problem } from "@repo/store";
import { useParams, useRouter } from "next/navigation";
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
  const params = useParams<{ trackIds: string[] }>();

  const [allProblemTitles, setAllProblemTitles] = useState<{ id: string; title: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        setIsOpen((prevState) => !prevState);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Jump To
          <div className="pl-2">
            <ArrowTopRightIcon />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allProblemTitles.map((problem: { id: string; title: string }, index: number) => (
          <DropdownMenuItem
            key={index}
            onClick={() => router.push(`/tracks/${props.track.id}/${problem.id}`)}
            className={`cursor-pointer ${params?.trackIds?.includes(problem.id) ? "bg-muted-foreground" : ""}`}
          >
            {index + 1} - {problem.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
