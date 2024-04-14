"use client";
import { usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./shad/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";
import { Track, Problem } from "@prisma/client";
import { HistoryList } from "./HistoryList";
// import Link from "next/link";

interface HistoryItem {
  trackId: string;
  problem: string;
}

export function History({ tracks }: { tracks: Track[] }) {
  const pathname = usePathname();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("pageHistory");
    if (!storedHistory) {
      localStorage.setItem("pageHistory", JSON.stringify([]));
      setHistory([]);
    } else {
      setHistory(JSON.parse(storedHistory).reverse());
    }

    let history = storedHistory ? JSON.parse(storedHistory) : [];

    function updateHistory(pathname: string) {
      if (pathname === "/") return;

      if (pathname.match("/tracks/")) {
        const trackId = pathname.split("/")[2];
        const problem = pathname.split("/")[3];

        history = history.filter((item: HistoryItem) => item.trackId !== trackId && item.problem !== problem);
        history.push({ trackId, problem });
        localStorage.setItem("pageHistory", JSON.stringify(history));
        setHistory(history.reverse());
      }
    }
    updateHistory(pathname);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="px-2">
          H
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn("overflow-y-auto max-h-[80vh]")}>
        {history.length > 0 &&
          history.map((item, index) => {
            const track = tracks.find((t) => t.id == item.trackId);
            if (!track) return null;
            return (
              <DropdownMenuItem key={index}>
                <HistoryList track={track} problemId={item.problem} />
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
