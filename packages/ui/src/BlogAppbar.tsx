import { Button } from "./shad/ui/button";
import { Problem, Track } from "@repo/store";
import { ReactNode, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./ModeToggle";
import { PageToggle } from "./PageToggle";
import { useRouter } from "next/navigation";

export const BlogAppbar = ({ problem, track }: { problem: Problem; track: Track }) => {
  const problemIndex = useMemo(() => {
    return track.problems.findIndex((p) => p === problem.id);
  }, [track, problem]);

  let totalPages = Array.from({ length: track.problems.length }, (_, i) => i + 1);

  function setTheme(arg0: string) {
    throw new Error("Function not implemented.");
  }

  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        router.push(
          problemIndex + 1 === track.problems.length ? `` : `/tracks/${track.id}/${track.problems[problemIndex + 1]}`
        );
      } else if (event.key === "ArrowLeft") {
        router.push(problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]}` : ``);
      }
    };

    // Add event listener for keydown events
    window.addEventListener("keydown", handleKeyPress);

    // Clean up event listener
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // empty dependency array ensures the effect runs only once

  return (
    <div className="flex flex-col items-center justify-between p-4 border-b shadow-md w-full dark:bg-zinc-950 bg-zinc-50 sticky top-0 z-50 pt-1">
      <div className="w-full flex flex-col items-center md:flex-row md:items-center md:justify-between mr-2">
        <div className="dark:text-zinc-100 text-zinc-950 font-semibold text-3xl mb-2 md:mb-0">
          <Link href={"/"}>DailyCode</Link>
        </div>

        <p className="flex-1 justify-center items-center font-medium ml-2 hidden md:flex">
          {problem.title} ({problemIndex + 1} / {track.problems.length})
        </p>
        <div>
          <PageToggle allProblemIds={track.problems} track={track} />
        </div>

        <div className="flex space-x-2">
          <Link
            prefetch={true}
            href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]}` : ``}
            style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}
          >
            <Button variant="outline" className="ml-2 bg-black text-white" disabled={problemIndex !== 0 ? false : true}>
              <div className="pr-2">
                <ChevronLeftIcon />
              </div>
              Prev
            </Button>
          </Link>

          <Link
            prefetch={true}
            href={
              problemIndex + 1 === track.problems.length
                ? ``
                : `/tracks/${track.id}/${track.problems[problemIndex + 1]}`
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
          <ModeToggle />
          <Link href={`/pdf/${track.id}/${track.problems[problemIndex]}`} target="_blank">
            <Button variant="outline" className="ml-2 bg-black text-white">
              Download
              <div className="pl-2">
                <DownloadIcon />
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <p className="flex-1 justify-center items-center font-medium ml-2 flex md:hidden pt-2 border-t w-full text-center bg-opacity-60">
        {problem.title} ({problemIndex + 1} / {track.problems.length})
      </p>
    </div>
  );
};
