import { Track, Problem } from "@prisma/client";
import { PageToggle } from "./PageToggle";
import Link from "next/link";
import { Button } from "@repo/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";


const Pagination = ({ allProblems, track ,problemIndex}: { allProblems: Problem[]; track: Track & { problems: Problem[] } ; problemIndex:number}) => {
  return (
    <div>
              <div className="flex space-x-2 mb-2 justify-center ">
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
     
        </div>
    </div>
  )
}

export default Pagination
