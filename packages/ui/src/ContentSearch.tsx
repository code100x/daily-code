"use client";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "./shad/ui/button";
import { Dialog, DialogClose, DialogContent } from "./shad/ui/dailog";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./shad/ui/input";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./shad/ui/card";
import { getSearch } from "web/lib/algolia";

interface data {
  id: string;
  notionDocId: string;
  title: string;
  trackId: string;
  trackTitle: string;
  image: string;
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function ContentSearch() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [searchTracks, setSearchTracks] = useState<data[]>([] as data[]);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "KeyK" && event.ctrlKey) {
        event.preventDefault();
        setDialogOpen(true);
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex + 1) % searchTracks.length);
      } else if (event.code === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex - 1 + searchTracks.length) % searchTracks.length);
      } else if (event.code === "Enter" && selectedIndex !== -1 ) {
        event.preventDefault();
        const selectedTrack = searchTracks[selectedIndex];
        window.open(`/tracks/${selectedTrack?.trackId}/${selectedTrack?.id}`, "_blank");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchTracks, selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== -1 && scrollableContainerRef.current) {
      const selectedElement = scrollableContainerRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const debouncedFetch = useCallback(
    debounce(async (searchQuery: string) => {
      const searchData:any  = await getSearch(searchQuery);
      setSearchTracks(searchData);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetch(input);
  }, [input,debouncedFetch]);

  function handleClose(open: boolean) {
    if (!open) setDialogOpen(false);
    setInput("");
  }

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
        <div className="h-[400px] py-4 space-y-4 overflow-y-scroll" ref={scrollableContainerRef}>
          {searchTracks.length > 0 &&
            searchTracks?.map((track, index) => (
              <div key={track.id} className={`p-2 ${index === selectedIndex ? "bg-blue-600/20" : ""}`}>
              <Link className="flex" href={`/tracks/${track.trackId}/${track.id}`} target="_blank" passHref>
                <Card className="p-2 w-full mx-2">
                  <div className="flex my-2" key={track.id}>
                    <img src={track.image} className="flex mx-2 w-1/6 rounded-xl" />
                    <div>
                      <CardHeader>
                        <CardTitle>{track.title}</CardTitle>
                        <CardDescription>{track.trackTitle}</CardDescription>
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
