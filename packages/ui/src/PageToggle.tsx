"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";
import { Button } from "./shad/ui/button";

import { useRouter } from "next/navigation";
export function PageToggle(props: any) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          title="page number"
          variant={"outline"}
          className="bg-background flex gap-4  items-center rounded-lg px-2"
        >
          <div className="">{props.problemIndex + 1}</div>
          <div className=" rounded-lg h-full ">/</div>
          {props.track.problems.length}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-72  overflow-y-auto scroll-smooth webkit-scrollbar" align="end">
        {props.totalPages.map((i: any, key: any): any => {
          return (
            <DropdownMenuItem
              key={key}
              className="mt-3"
              onClick={() => router.push(`/tracks/${props.track.id}/${props.track.problems[i - 1]}`)}
            >
              {i}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
