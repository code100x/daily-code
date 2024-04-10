"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "./shad/ui/button";
import { Dialog, DialogClose, DialogContent } from "./shad/ui/dailog";
import { useEffect, useRef, useState } from "react";
import { Input } from "./shad/ui/input";
import { Track, Problem } from "@prisma/client";
import { TrackList } from "./TrackList";
import { useRouter } from "next/navigation";

export function SearchDialog({ tracks }: { tracks: (Track & { problems: Problem[] })[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [searchTracks, setSearchTracks] = useState(tracks);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const searchFilterListRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "KeyK" && event.ctrlKey) {
        event.preventDefault();
        setDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "ArrowDown") {
        event.preventDefault();

        const list = searchFilterListRef.current;
        if (list && selectedTrack + 1 < searchTracks.length) {
          const currentItem = list.children[selectedTrack + 1];
          if ((list[selectedTrack + 1] && !currentItem.offsetHeight) || currentItem.offsetTop > list.offsetHeight) {
            currentItem.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }

        setSelectedTrack((prev) => {
          if (prev < searchTracks.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }
      if (event.code === "ArrowUp") {
        event.preventDefault();

        const list = searchFilterListRef.current;
        if (list && selectedTrack - 1 > -1) {
          const currentItem = list.children[selectedTrack - 1];
          if ((list[selectedTrack - 1] && !currentItem.offsetHeight) || currentItem.offsetTop < list.offsetHeight) {
            currentItem.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }

        setSelectedTrack((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }
      if (event.code === "Enter") {
        event.preventDefault();
        router.push(`/tracks/${searchTracks[selectedTrack].id}/${searchTracks[selectedTrack].problems[0]?.id}`);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchTracks, selectedTrack]);

  const autoScroll = (e) => {
    console.log(e.target.offsetHeight);
  };

  useEffect(() => {
    const foundTracks = tracks.filter((track) => {
      return (
        track.title.toLowerCase().includes(input.toLowerCase()) ||
        track.description.toLowerCase().includes(input.toLowerCase())
      );
    });
    setSearchTracks(foundTracks);
    setSelectedTrack(0);
  }, [input]);

  function handleClose(open: boolean) {
    if (!open) setDialogOpen(false);
    setInput("");
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <Button variant="outline" className="pr-2" onClick={() => setDialogOpen(true)}>
        <div className="flex gap-2 items-center">
          <MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem]" />
          Search...
          <kbd className="bg-white/15 p-1.5 rounded-sm text-xs leading-3">Ctrl K</kbd>
        </div>
      </Button>
      <DialogContent className="p-0 gap-0 max-w-2xl ">
        <div className="flex items-center px-4 py-2 border-b">
          <MagnifyingGlassIcon className="h-[1.5rem] w-[1.5rem]" />
          <Input
            type="text"
            placeholder="Type title"
            className="border-none focus-visible:outline-none focus-visible:ring-0 text-base shadow-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <DialogClose>
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="h-[400px] overflow-y-scroll" onKeyDown={autoScroll} ref={searchFilterListRef}>
          {searchTracks.map((track, index) => (
            <TrackList key={track.id} track={track} selected={selectedTrack === index} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
