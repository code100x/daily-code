"use client";
import { useCallback, useEffect, useRef, useState, useDeferredValue } from "react";
import Link from "next/link";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  Input,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { getSearchResults } from "../lib/search";

export function ContentSearch() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [searchTracks, setSearchTracks] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const deferredInput = useDeferredValue(input);

  useEffect(() => {
    async function fetchSearchResults() {
      if (deferredInput.length > 0) {
        const data = await getSearchResults(deferredInput);
        setSearchTracks(data);
      } else {
        setSearchTracks([]);
      }
    }
    fetchSearchResults();
  }, [deferredInput]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyL":
          if (event.ctrlKey) {
            event.preventDefault();
            setDialogOpen(true);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prevIndex) => (prevIndex + 1) % searchTracks.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prevIndex) => (prevIndex - 1 + searchTracks.length) % searchTracks.length);
          break;
        case "Enter":
          if (selectedIndex !== -1) {
            event.preventDefault();
            const selectedTrack = searchTracks[selectedIndex];
            window.open(`/tracks/${selectedTrack?.payload.trackId}/${selectedTrack?.payload.problemId}`, "_blank");
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [searchTracks, selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== -1 && scrollableContainerRef.current) {
      const selectedElement = scrollableContainerRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleClose = (open: boolean) => {
    if (!open) {
      setDialogOpen(false);
      setInput("");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <Button variant="outline" className="pr-2" onClick={() => setDialogOpen(true)}>
        <div className="md:flex gap-2 items-center hidden">
          <MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem]" />
          Search...
          <kbd className="bg-white/15 p-1.5 rounded-sm text-xs leading-3">Ctrl K</kbd>
        </div>
        <div className="block md:hidden">
          <MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem]" />
        </div>
      </Button>
      <DialogContent className="p-0 gap-0 max-w-2xl">
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
        <div className="h-[400px] py-4 space-y-4 overflow-y-scroll" ref={scrollableContainerRef}>
          {searchTracks.length > 0 &&
            searchTracks.map((track, index) => (
              <div key={track.payload.problemId} className={`p-2 ${index === selectedIndex ? "bg-blue-600/20" : ""}`}>
                <Link
                  className="flex"
                  href={`/tracks/${track.payload.trackId}/${track.payload.problemId}`}
                  target="_blank"
                  passHref
                >
                  <Card className="p-2 w-full mx-2">
                    <div className="flex my-2">
                      <img
                        alt={track.payload.problemTitle}
                        src={track.payload.image}
                        className="flex mx-2 w-1/6 rounded-xl"
                      />
                      <div>
                        <CardHeader>
                          <CardTitle>{track.payload.problemTitle}</CardTitle>
                          <CardDescription>{track.payload.trackTitle}</CardDescription>
                        </CardHeader>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}