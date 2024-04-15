"use client";

import { Button } from "./shad/ui/button";
import { Problem, Track, CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./ModeToggle";
import { PageToggle } from "./PageToggle";
import { useRouter } from "next/navigation";
import { Codebar } from "./code/Codebar";

type BlogAppbarProps = {
  problem: Problem & { notionRecordMap: any } & {
    problemStatement:
      | (ProblemStatement & {
          languagesSupported: CodeLanguage[];
          testCases: TestCase[];
        })
      | null;
  };
  track: Track & { problems: Problem[] };
};

/**
 * Debounce function to limit the number of times a function is called
 * @param func any function
 * @param timeout in milliseconds
 * @returns debouncedFn
 */
const debounce = (func: Function, timeout = 300) => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

export const BlogAppbar = ({ problem, track }: BlogAppbarProps) => {
  const problemIndex = useMemo(() => {
    return track.problems.findIndex((p) => p.id === problem.id);
  }, [track, problem]);

  const router = useRouter();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollingDown, setScrollingDown] = useState(false);

  const debouncedHandleScroll = useCallback(
    debounce(() => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);
      setScrollingDown(prevScrollPos < currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    }, 90),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [debouncedHandleScroll]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        router.push(
          problemIndex + 1 === track.problems.length
            ? ``
            : `/tracks/${track.id}/${track.problems[problemIndex + 1]?.id}`
        );
      } else if (event.key === "ArrowLeft") {
        router.push(problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]?.id}` : ``);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-between p-4 border-b shadow-md w-full dark:bg-zinc-950 bg-zinc-50 sticky top-0 z-50 transition-transform duration-300 ${
        !visible && scrollingDown ? "transform -translate-y-full " : " "
      }`}
      style={{ transform: !visible && !scrollingDown ? "translateY(0)" : "" }}
    >
      <div className="w-full flex flex-col items-center md:flex-row md:items-center md:justify-between mr-2">
        <Link href={"/"} className="dark:text-zinc-100 text-zinc-950 font-semibold text-3xl mb-2 md:mb-0">
          DailyCode
        </Link>

        <p className="flex-1 justify-center items-center font-medium ml-2 hidden md:flex">
          {problem.title} ({problemIndex + 1} / {track.problems.length})
        </p>

        <div className="flex space-x-2">
          {problem.type === "Code" && problem.problemStatement && (
            <Codebar problemStatement={problem.problemStatement} />
          )}
          <PageToggle allProblems={track.problems} track={track} />
          <Link
            prefetch={true}
            href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}` : ``}
            style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}
          >
            <Button variant="outline" disabled={problemIndex !== 0 ? false : true}>
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
                : `/tracks/${track.id}/${track.problems[problemIndex + 1]!.id}`
            }
            style={{ cursor: problemIndex + 1 !== track.problems.length ? "pointer" : "not-allowed" }}
          >
            <Button variant="outline" className="" disabled={problemIndex + 1 !== track.problems.length ? false : true}>
              Next
              <div className="pl-2">
                <ChevronRightIcon />
              </div>
            </Button>
          </Link>
          <ModeToggle />
          <Link href={`/pdf/${track.id}/${track.problems[problemIndex]!.id}`} target="_blank">
            <Button variant="outline" className=" ">
              Download
              <div className="pl-2">
                <DownloadIcon />
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <p className="flex-1 justify-center items-center font-medium ml-2 flex md:hidden pt-2 w-full text-center bg-opacity-60">
        {problem.title} ({problemIndex + 1} / {track.problems.length})
      </p>
    </div>
  );
};
