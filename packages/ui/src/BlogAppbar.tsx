import { Button } from "./shad/ui/button";
import { Problem, Track } from "@repo/store";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./ModeToggle";
import { PageToggle } from "./PageToggle";

export const BlogAppbar = ({ problem, track }: { problem: Problem; track: Track }) => {
  const router = useRouter();

  const backButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const problemIndex = useMemo(() => {
    return track.problems.findIndex((p) => p === problem.id);
  }, [track, problem]);

  const nextLink =
    problemIndex + 1 === track.problems.length
      ? `/tracks/${track.id}`
      : `/tracks/${track.id}/${track.problems[problemIndex + 1]}`;

  const prevLink =
    problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]}` : `/tracks/${track.id}`;

  let totalPages = Array.from({ length: track.problems.length }, (_, i) => i + 1);

  function setTheme(arg0: string) {
    throw new Error("Function not implemented.");
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        router.push(prevLink);
        backButtonRef.current?.focus();
      } else if (event.key === "ArrowRight") {
        router.push(nextLink);
        nextButtonRef.current?.focus();
      }
    },
    [prevLink, nextLink, router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center justify-between p-4 border-b shadow-md w-full dark:bg-zinc-950 bg-zinc-50 sticky top-0 z-50">
      <div className="w-full flex items-center justify-between mb-2 md:mb-0">
        <div className="dark:text-zinc-100 text-zinc-950 font-semibold text-2xl">
          <Link href={"/"}>DailyCode</Link>
        </div>

        <p className="flex-1 justify-center items-center font-medium ml-2 hidden md:flex">
          {problem.title} ({problemIndex + 1} / {track.problems.length})
        </p>
        <div>
          <PageToggle allProblemIds={track.problems} track={track} />
        </div>

        <div className="flex space-x-2">
          <Link prefetch={true} href={prevLink}>
            <Button variant="outline" className="ml-2 bg-black text-white" ref={backButtonRef}>
              <div className="pr-2">
                <ChevronLeftIcon />
              </div>
              Prev
            </Button>
          </Link>

          <Link prefetch={true} href={nextLink}>
            <Button variant="outline" className="bg-black text-white" ref={nextButtonRef}>
              Next
              <div className="pl-2">
                <ChevronRightIcon />
              </div>
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>

      <p className="flex-1 justify-center items-center font-medium ml-2 flex md:hidden pt-2 border-t w-full text-center bg-opacity-60">
        {problem.title} ({problemIndex + 1} / {track.problems.length})
      </p>
    </div>
  );
};
