import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { getFunction } from "@repo/common";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./shad/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";
import { Track, Problem } from "@prisma/client";

export function PageToggle({ allProblems, track }: { allProblems: Problem[]; track: Track & { problems: Problem[] } }) {
  const router = useRouter();

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
        {allProblems.map((problem: { id: string; title: string }, index: number) => (
          <DropdownMenuItem key={index} onClick={() => router.push(`/tracks/${track.id}/${problem.id}`)}>
            {index + 1} - {problem.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
