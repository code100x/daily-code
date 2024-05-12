"use client";

import { Button } from "@repo/ui/shad/ui";
import { Problem, Track, CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./ModeToggle";
import { PageToggle } from "./PageToggle";
import { useRouter } from "next/navigation";
import UserAccountDropDown from "./UserAccountDropDown";
import { Codebar } from "web/components/code/Codebar";

export const BlogAppbar = ({
  problem,
  track,
  problemIndex
}: {
  problem: Problem & { notionRecordMap: any } & {
    problemStatement?:
      | (ProblemStatement & {
          languagesSupported: CodeLanguage[];
          testCases: TestCase[];
        })
      | null;
  };
  track: Track & { problems: Problem[] };
  problemIndex: number
}) => {
  let totalPages = Array.from({ length: track.problems.length }, (_, i) => i + 1);

  function setTheme(arg0: string) {
    throw new Error("Function not implemented.");
  }

  const router = useRouter();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollingDown, setScrollingDown] = useState(false);

  const debounce = (func: any, delay: any) => {
    let timeoutId: any;
    return (...args: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedHandleScroll = debounce(() => {
    const currentScrollPos = window.scrollY;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);
    setScrollingDown(prevScrollPos < currentScrollPos);
    setPrevScrollPos(currentScrollPos);
  }, 90); // Adjust the delay (in milliseconds) as needed

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);
    setScrollingDown(prevScrollPos < currentScrollPos);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [prevScrollPos, debouncedHandleScroll]);

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

    // Add event listener for keydown events
    window.addEventListener("keydown", handleKeyPress);

    // Clean up event listener
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // empty dependency array ensures the effect runs only once

  return (
    <div
      className={`flex flex-col items-center justify-between p-4 border-b shadow-md w-full dark:bg-zinc-950 bg-zinc-50 sticky top-0 z-50 transition-transform duration-300 ${
        !visible && scrollingDown ? "transform -translate-y-full " : " "
      }`}
      style={{ transform: !visible && !scrollingDown ? "translateY(0)" : "" }}
    >
      <div className="w-full flex flex-col items-center md:flex-row md:items-center md:justify-between mr-2">
        <div className="dark:text-zinc-100 text-zinc-950 font-semibold text-3xl mb-2 md:mb-0">
          <Link href={"/"}>DailyCode</Link>
        </div>

        <p className="flex-1 justify-center items-center font-medium ml-2 hidden md:flex">
          {track.title} ({problemIndex + 1} / {track.problems.length})
        </p>
        {problem.type === "Code" && problem.problemStatement && <Codebar problemStatement={problem.problemStatement} />}
        <div className="flex space-x-2 mb-2">
          <div className="mb-2">
            <PageToggle allProblems={track.problems} track={track} />
          </div>
          <Link
            prefetch={true}
            href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}` : ``}
            style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}
          >
            <Button
              variant="outline"
              className="ml-2 bg-black text-white md:flex hidden"
              disabled={problemIndex !== 0 ? false : true}
            >
              <div className="pr-2">
                <ChevronLeftIcon />
              </div>
              Prev
            </Button>
            <Button
              variant="outline"
              className=" bg-black text-white md:hidden block"
              disabled={problemIndex !== 0 ? false : true}
            >
              <div>
                <ChevronLeftIcon />
              </div>
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
            <Button
              variant="outline"
              className="bg-black text-white md:flex hidden"
              disabled={problemIndex + 1 !== track.problems.length ? false : true}
            >
              Next
              <div className="pl-2">
                <ChevronRightIcon />
              </div>
            </Button>
            <Button
              variant="outline"
              className="bg-black text-white md:hidden block"
              disabled={problemIndex + 1 !== track.problems.length ? false : true}
            >
              <div>
                <ChevronRightIcon />
              </div>
            </Button>
          </Link>
          <ModeToggle />
          <Link href={`/pdf/${track.id}/${track.problems[problemIndex]!.id}`} target="_blank">
            <Button variant="outline" className="ml-2 bg-black text-white md:flex hidden">
              Download
              <div className="pl-2">
                <DownloadIcon />
              </div>
            </Button>
            <Button variant="outline" className=" bg-black text-white md:hidden block">
              <div>
                <DownloadIcon />
              </div>
            </Button>
          </Link>
          <UserAccountDropDown />
        </div>
      </div>

      <p className="flex-1 justify-center items-center font-medium ml-2 flex md:hidden pt-2 border-t w-full text-center bg-opacity-60">
        {track.title} ({problemIndex + 1} / {track.problems.length})
      </p>
    </div>
  );
};
