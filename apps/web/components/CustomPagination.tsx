import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ArrowUp, ChevronLeft, ChevronRight, HomeIcon } from "lucide-react";
import { motion } from "framer-motion";

const CustomPagination = ({
  isAtHeader = false,
  problemIndex,
  track,
}: {
  allProblems: Problem[];
  isAtHeader?: boolean;
  problemIndex: number;
  track: Track & { problems: Problem[] };
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-center space-x-2 p-4">
      <Link href={"/"}>
        <Button className="gap-2 bg-black text-white md:flex" size={"lg"} variant="outline">
          <span className="hidden lg:block">Home</span>
          <HomeIcon className="size-4" />
        </Button>
      </Link>
      <PageToggle allProblems={track.problems} isAtHeader track={track} />
      <Link
        prefetch
        href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}` : ``}
        style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}
      >
        <Button
          variant="outline"
          className="hidden bg-black text-white md:flex"
          size={"lg"}
          disabled={problemIndex !== 0 ? false : true}
        >
          <div className="pr-2">
            <ChevronLeft className="size-4" />
          </div>
          <span className={isAtHeader ? "hidden lg:block" : ""}>Prev</span>
        </Button>
        <Button
          variant="outline"
          className="block bg-black text-white md:hidden"
          size={"lg"}
          disabled={problemIndex !== 0 ? false : true}
        >
          <div>
            <ChevronLeft className="size-4" />
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
          className="hidden bg-black text-white md:flex"
          size={"lg"}
          disabled={problemIndex + 1 !== track.problems.length ? false : true}
        >
          <span className={isAtHeader ? "hidden lg:block" : ""}>Next</span>
          <div className="pl-2">
            <ChevronRight className="size-4" />
          </div>
        </Button>
        <Button
          variant="outline"
          className="block bg-black text-white md:hidden"
          size={"lg"}
          disabled={problemIndex + 1 !== track.problems.length ? false : true}
        >
          <div>
            <ChevronRight className="size-4" />
          </div>
        </Button>
      </Link>
      <Button className="gap-2 bg-black text-white md:flex" onClick={scrollToTop} size={"lg"} variant="outline">
        <span className="hidden lg:block">Go to Top</span>
        <ArrowUp className="size-4" />
      </Button>
    </div>
  );
};

export default CustomPagination;
