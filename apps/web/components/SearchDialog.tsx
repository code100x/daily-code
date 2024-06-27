"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Dialog, DialogClose, DialogContent, Button, Input } from "@repo/ui";
import { useEffect, useRef, useState } from "react";
import { Track, Problem } from "@prisma/client";
import { TrackList } from "./TrackList";
import Link from "next/link";

export function SearchDialog({ tracks }: { tracks: (Track & { problems: Problem[] })[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [searchTracks, setSearchTracks] = useState(tracks);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [shortcut, setShortcut] = useState("Ctrl K");
  const [filteredsearchTrack, setfilteredsearchTrack] = useState<any>();
  const debounceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "KeyK" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setDialogOpen(true);
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, searchTracks.length - 1));
      } else if (event.code === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (event.code === "Enter" && selectedIndex !== -1) {
        event.preventDefault();
        document.getElementById(`track-link-${selectedIndex}`)?.click();
      }
      if (event.code === "ArrowDown" || event.code === "ArrowUp") {
        event.preventDefault();
        const container = scrollableContainerRef.current;
        if (container) {
          if (selectedIndex > 3) {
            const scrollAmount = event.code === "ArrowDown" ? 85 : -80;
            container.scrollBy({ top: scrollAmount, behavior: "smooth" });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchTracks, selectedIndex]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = window.setTimeout(() => {
      const foundTracks = tracks.filter((track) => {
        return track.problems.some((problem) => problem.title.toLowerCase().includes(input.toLowerCase()));
      });
      setSearchTracks(foundTracks);
      const foundPgNumbers = foundTracks.reduce((acc: string[], foundTrack) => {
        foundTrack.problems.forEach((problem) => {
          if (problem.title.toLowerCase().includes(input.toLowerCase())) {
            acc.push(problem.id);
          }
        });
        return acc;
      }, []);
      const filteredSearchTracksarr = foundTracks.map((track) => ({
        track: track,
        matchingProblemIds: track.problems
          .filter((problem) => foundPgNumbers.includes(problem.id))
          .map((problem) => problem.id),
      }));
      setfilteredsearchTrack(filteredSearchTracksarr);
      setSelectedIndex(-1);
    }, 700);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [input]);

  useEffect(() => {
    const isMacOS = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    setShortcut(isMacOS ? "Cmd K" : "Ctrl K");
  }, []);

  function handleClose(open: boolean) {
    if (!open) setDialogOpen(false);
    setInput("");
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <Button variant="outline" className="pr-2" onClick={() => setDialogOpen(true)}>
        <div className="items-center hidden gap-2 md:flex">
          <MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem]" />
          Search...
          <kbd className="bg-white/15 p-1.5 rounded-sm text-xs leading-3">{shortcut}</kbd>
        </div>
        <div className="block md:hidden">
          <MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem]" />
        </div>
      </Button>
      <DialogContent className="max-w-2xl gap-0 p-0 ">
        <div className="flex items-center px-4 py-2 border-b">
          <MagnifyingGlassIcon className="h-[1.5rem] w-[1.5rem]" />
          <Input
            type="text"
            placeholder="Type title"
            className="text-base border-none shadow-none focus-visible:outline-none focus-visible:ring-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <DialogClose>
            <Cross2Icon className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="h-[400px] overflow-y-scroll" ref={scrollableContainerRef}>
          {Array.isArray(filteredsearchTrack) &&
            filteredsearchTrack.map((item, index) => (
              <div key={item.track.id} className={`p-2 ${index === selectedIndex ? "bg-blue-600/20" : ""}`}>
                <div className="flex space-y-2">
                  <Link href={`/tracks/${item.track.id}`} passHref>
                    <p id={`track-link-${index}`} tabIndex={-1} style={{ display: "none" }}>
                      Navigate
                    </p>
                  </Link>
                  {input && (
                    <div className="flex items-center space-x-2 space-y-2 text-zinc-950 dark:text-zinc-50 p-2 font-semibold border-2 rounded-full py-1 w-full">
                      {<p>Jump to</p>}
                      <ul className="flex items-center space-x-2 justify-center group ">
                        {item.matchingProblemIds.map((problemId: any, idx: any) => (
                          <li key={idx}>
                            <Link href={`/tracks/${item.track.id}/${problemId}`} passHref>
                              <Button size={"sm"} className="flex items-center justify-center group">
                                {problemId}
                              </Button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <TrackList track={item.track} />
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
