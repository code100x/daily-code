"use client";

import { Problem, Track, CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Separator } from "@repo/ui";
import { ModeToggle } from "./ModeToggle";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import UserAccountDropDown from "./UserAccountDropDown";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Menu, User, X } from "lucide-react";
import { Codebar } from "./code/Codebar";

export const BlogAppbar = ({
  problem,
  track,
  problemIndex,
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
  problemIndex: number;
}) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const storedPreference = localStorage.getItem("modeToggleIsOpen");
    return storedPreference === "true" || false;
  });
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setVisible(false);
        setIsOpen(false);
      } else {
        // Scrolling up
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

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
  }, [problemIndex, router, track]);

  return (
    <motion.div
      className={`w-full justify-between z-[50] flex flex-col md:flex-row gap-2 p-6 ${visible ? "translate-y-0" : "-translate-y-full"}`}
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 items-center">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer flex gap-4 p-3 text-primary bg-black/10 backdrop-blur-lg rounded-lg border border-primary/10 items-center"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
          className="flex gap-2 justify-between"
        >
          <div
            className={`flex gap-4 p-2 bg-black/10 backdrop-blur-lg rounded-lg border border-primary/10 items-center transition-all duration-500 ease-in-out `}
          >
            <Link href={"/"} className="hidden md:flex items-center gap-4 cursor-pointer">
              <Image
                src={"https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/main.png"}
                alt="Logo"
                width={200}
                height={200}
                className="rounded-full size-8"
              />
            </Link>
            <Separator className="hidden md:flex w-0.5 h-6 bg-primary/25" />
            {problem.type === "Code" && problem.problemStatement && (
              <Codebar problemStatement={problem.problemStatement} />
            )}
            <h4 className="tracking-tighter flex items-center md:text-lg font-medium gap-2 md:max-w-[50vw]">
              {track.title}{" "}
              <span className="text-primary/80 text-sm">
                {problemIndex + 1} of {track.problems.length}
              </span>
            </h4>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
        className="flex gap-2"
      >
        <div
          className={`flex gap-2 p-2 bg-black/10 backdrop-blur-lg rounded-lg border border-primary/10 items-center transition-all duration-500 ease-in-out ${
            isOpen ? `translate-y-0 opacity-100` : `-translate-y-32 opacity-0`
          }`}
        >
          {!user ? (
            <Button
              size={"default"}
              onClick={async () => {
                await signIn();
              }}
              className="flex gap-2"
            >
              <User className="size-4" />
              Login
            </Button>
          ) : (
            <UserAccountDropDown />
          )}
          <Link href={`/pdf/${track.id}/${track.problems[problemIndex]!.id}`} target="_blank">
            <Button className="flex gap-2" size={"default"}>
              Download
              <Download className="size-4" />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </motion.div>
    </motion.div>
  );
};
