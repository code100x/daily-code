"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./shad/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";
import { HistoryList } from "./HistoryList";
import { useSession } from "next-auth/react";
import { updateUserHistory, getUsersHistory } from "../../../apps/web/components/utils";

interface Track {
  title: string;
  description: string;
  image: string;
}
interface HistoryItem {
  id: string;
  trackId: string;
  problemId: string;
  track: Track;
}

export function History() {
  const pathname = usePathname();
  const session = useSession();
  const email = session.data?.user?.email;
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!email) return;

    async function fetchHistory() {
      if (email) {
        try {
          const history = await getUsersHistory(email);
          console.log("history :", history);
          setHistory(history as HistoryItem[]);
        } catch (e) {}
      }
    }

    async function updateHistory(pathname: string) {
      if (pathname === "/") return;

      if (pathname.match("/tracks/")) {
        const trackId = pathname.split("/")[2];
        const problemId = pathname.split("/")[3];
        //update history
        try {
          if (email && trackId && problemId) {
            await updateUserHistory(email, trackId, problemId);
            await fetchHistory();
          }
        } catch (e) {}
      }
    }
    fetchHistory();
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
          history.map((item) => {
            return (
              <DropdownMenuItem key={item.id}>
                <HistoryList
                  trackId={item.trackId}
                  problemId={item.problemId}
                  trackImg={item.track.image}
                  trackDescription={item.track.description}
                  trackTitle={item.track.title}
                />
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
