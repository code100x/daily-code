import { useParams } from "next/navigation";
import { cn } from "@repo/ui/utils";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui";
import { Track, Problem } from "@prisma/client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";

export function PageToggle({ allProblems, track }: { allProblems: Problem[]; track: Track & { problems: Problem[] } }) {
  const { trackIds }: { trackIds: string[] } = useParams();
  const { resolvedTheme } = useTheme();
  const currentTrack = trackIds.join("/");
  const isDarkMode = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`flex gap-2 font-semibold ${isDarkMode ? "bg-[#323232]" : "bg-slate-50"}`}
          size={"lg"}
          variant={"secondary"}
        >
          <span className="hidden md:block">Jump To</span>
          <ArrowUpRight className="size-4" />
        </Button>
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
