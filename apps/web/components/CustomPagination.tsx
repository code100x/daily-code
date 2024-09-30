import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

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
  return (
    <div className="flex items-center justify-center space-x-2">
      <PageToggle allProblems={track.problems} isAtHeader track={track} />
      <Link
        prefetch
        href={problemIndex !== 0 ? `/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}` : ``}
        style={{ cursor: problemIndex !== 0 ? "pointer" : "not-allowed" }}
      >
        <Button
          variant="outline"
          className="ml-2 hidden bg-black text-white md:flex"
          disabled={problemIndex !== 0 ? false : true}
        >
          <div className="pr-2">
            <ChevronLeftIcon />
          </div>
          <span className={isAtHeader ? "hidden lg:block" : ""}>Prev</span>
        </Button>
        <Button
          variant="outline"
          className="block bg-black text-white md:hidden"
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
          className="hidden bg-black text-white md:flex"
          disabled={problemIndex + 1 !== track.problems.length ? false : true}
        >
          <span className={isAtHeader ? "hidden lg:block" : ""}>Next</span>
          <div className="pl-2">
            <ChevronRightIcon />
          </div>
        </Button>
        <Button
          variant="outline"
          className="block bg-black text-white md:hidden"
          disabled={problemIndex + 1 !== track.problems.length ? false : true}
        >
          <div>
            <ChevronRightIcon />
          </div>
        </Button>
      </Link>
    </div>
  );
};

export default CustomPagination;
