import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const TrackTools = ({
  track,
  problemIndex,
}: {
  allProblems: Problem[];
  track: Track & { problems: Problem[] };
  problemIndex: number;
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
      className="flex gap-2 justify-between w-full items-center p-6"
    >
      <div className="flex gap-2 p-1 bg-black/10 backdrop-blur-lg rounded-lg border border-primary/10">
        <Link 
        href={"/"}>
          <Button className="flex gap-2 font-semibold dark:#eb3232 text-white bg-[#eb3232]" size={"lg"}>
            Back to home
          </Button>
        </Link>
        <PageToggle allProblems={track.problems} track={track} />
        <Link
          prefetch={true}
          href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}` : ``}
          style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}
        >
          <Button
            className="flex gap-2 font-semibold dark:bg-slate-50 bg-[#323232]"
            disabled={problemIndex === 0}
            size={"lg"}
          >
            <ChevronLeft className="size-4" />
            <span className="hidden md:block">Prev</span>
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
            className="flex gap-2 font-semibold dark:bg-slate-50 bg-[#323232]"
            disabled={problemIndex + 1 === track.problems.length}
            size={"lg"}
          >
            <span className="hidden md:block">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </Link>

        {/* To Top */}
        <Button className="flex gap-2 dark:bg-[#323232]" onClick={scrollToTop} size={"lg"} variant={"secondary"}>
          <span className="hidden md:block">Go to Top</span>
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TrackTools;
