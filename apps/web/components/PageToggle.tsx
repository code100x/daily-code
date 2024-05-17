import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useParams } from "next/navigation";
import { cn } from "@repo/ui/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button } from "@repo/ui";
import { Track, Problem } from "@prisma/client";
import Link from "next/link";

export function PageToggle({ allProblems, track }: { allProblems: Problem[]; track: Track & { problems: Problem[] } }) {
  const { trackIds }: { trackIds: string[] } = useParams();
  const currentTrack = trackIds.join("/");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button variant="outline" className="md:flex hidden">
            Jump To
            <div className="pl-2">
              <ArrowTopRightIcon />
            </div>
          </Button>
          <Button variant="outline" className="md:hidden block">
            <div>
              <ArrowTopRightIcon />
            </div>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn("overflow-y-auto max-h-[80vh]")}>
        {allProblems.map((problem: { id: string; title: string }, index: number) => (
          <DropdownMenuItem key={index} disabled={currentTrack === `${track.id}/${problem.id}`}>
            <Link
              key={problem.id}
              prefetch={true}
              className="max-w-screen-md w-full"
              href={`/tracks/${track.id}/${problem.id}`}
            >
              {index + 1} - {problem.title}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
