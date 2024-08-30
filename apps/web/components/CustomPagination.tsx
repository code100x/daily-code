import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

const CustomPagination = ({
  allProblems,
  track,
  problemIndex,
}: {
  allProblems: Problem[];
  track: Track & { problems: Problem[] };
  problemIndex: number;
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <PageToggle allProblems={track.problems} track={track} />
      <Link
        prefetch={true}
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
          Prev
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
          Next
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
