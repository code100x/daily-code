import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { cn } from "../lib/utils";
import { Button } from "./shad/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";
import { Track, Problem } from "@prisma/client";
import Link from "next/link";

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
          <Link
            key={problem.id}
            prefetch={true}
            className="max-w-screen-md w-full"
            href={`/tracks/${track.id}/${problem.id}`}
          >
            <DropdownMenuItem key={index}>
              {index + 1} - {problem.title}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
