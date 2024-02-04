"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";
import { Button } from "./shad/ui/button";

import { usePathname, useRouter } from "next/navigation";

export function PageToggle(props: any) {
  const router = useRouter();
  const currentPage = usePathname();
  const currentPageNumber = currentPage.split("-");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <h2>{currentPageNumber[1]}</h2>
          <span className="sr-only">Toggle Page</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {props.totalPages.map((i: any, key: any): any => {
          return (
            <DropdownMenuItem
              onClick={() => router.push(`/tracks/${props.track.id}/${props.track.problems[i - 1]}`)}
              key={key}
            >
              {i}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
