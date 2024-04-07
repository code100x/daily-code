"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "./shad/ui/button";
import { Dialog, DialogClose, DialogContent } from "./shad/ui/dailog";
import { useEffect, useState } from "react";
import { Input } from "./shad/ui/input";
import { Track, Problem } from "@prisma/client";
import { TrackList } from "./TrackList";

export function SearchDialog({ tracks }: { tracks: (Track & { problems: Problem[] })[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [searchTracks, setSearchTracks] = useState(tracks);

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
    const foundTracks = tracks.filter((track) => {
      return (
        track.title.toLowerCase().includes(input.toLowerCase()) ||
        track.description.toLowerCase().includes(input.toLowerCase())
      );
    });
    setSearchTracks(foundTracks);
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
        <div className="h-[400px] overflow-y-scroll">
          {searchTracks.map((track) => (
            <TrackList track={track} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
