import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <div className="flex items-center justify-center space-x-2">
      <PageToggle allProblems={track.problems} isAtHeader track={track} />
      <Button
        variant="outline"
        className="ml-2 hidden bg-black text-white md:flex"
        disabled={problemIndex === 0}
        onClick={() => {
          if (problemIndex !== 0) {
            router.push(`/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}`);
          }
        }}
      >
        <div className="pr-2">
          <ChevronLeftIcon />
        </div>
        <span className={isAtHeader ? "hidden lg:block" : ""}>Prev</span>
      </Button>
      <Button
        variant="outline"
        className="block bg-black text-white md:hidden"
        disabled={problemIndex === 0}
        onClick={() => {
          if (problemIndex !== 0) {
            router.push(`/tracks/${track.id}/${track.problems[problemIndex - 1]!.id}`);
          }
        }}
      >
        <div>
          <ChevronLeftIcon />
        </div>
      </Button>

      <Button
        variant="outline"
        className="hidden bg-black text-white md:flex"
        disabled={problemIndex + 1 === track.problems.length}
        onClick={() => {
          if (problemIndex + 1 !== track.problems.length) {
            router.push(`/tracks/${track.id}/${track.problems[problemIndex + 1]!.id}`);
          }
        }}
      >
        <span className={isAtHeader ? "hidden lg:block" : ""}>Next</span>
        <div className="pl-2">
          <ChevronRightIcon />
        </div>
      </Button>
      <Button
        variant="outline"
        className="block bg-black text-white md:hidden"
        disabled={problemIndex + 1 === track.problems.length}
        onClick={() => {
          if (problemIndex + 1 !== track.problems.length) {
            router.push(`/tracks/${track.id}/${track.problems[problemIndex + 1]!.id}`);
          }
        }}
      >
        <div>
          <ChevronRightIcon />
        </div>
      </Button>
    </div>
  );
};

export default CustomPagination;
