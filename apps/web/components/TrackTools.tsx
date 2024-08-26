import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
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
        <PageToggle allProblems={track.problems} track={track} />
        <Link
          prefetch={true}
          href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}` : ``}
          style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}
        >
          <Button size={"lg"} className="flex gap-2 font-semibold" disabled={problemIndex === 0}>
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
            size={"lg"}
            className="flex gap-2 font-semibold"
            disabled={problemIndex + 1 === track.problems.length}
          >
            <span className="hidden md:block">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </Link>

        {/* To Top */}
        <Button onClick={scrollToTop} className="flex gap-2 " variant={"secondary"} size={"lg"}>
          <span className="hidden md:block">Go to Top</span>
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TrackTools;
