"use client";
import { useEffect, useRef, useState, useDeferredValue } from "react";
import Link from "next/link";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
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
import Image from "next/image";
import Fuse from "fuse.js";
import { getAllTracks } from "./utils";

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
    async function fetchSearchResults() {
      if (deferredInput.length > 0) {
        const allTracks = await getAllTracks();
        console.log(allTracks);

        const options = {
          keys: ["title"],
          includeScore: true,
          threshold: 0.3,
        };

        const fuse = new Fuse(allTracks, options);

        const filteredTracks = fuse.search(
          `${deferredInput.toLocaleLowerCase()}`
        );

        setSearchTracks(filteredTracks);
      } else {
        setSearchTracks([]);
      }
    }

    fetchSearchResults();
  }, [deferredInput]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyK":
          if (event.ctrlKey) {
            event.preventDefault();
            setDialogOpen(true);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex(
            (prevIndex) => (prevIndex + 1) % searchTracks.length
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex(
            (prevIndex) =>
              (prevIndex - 1 + searchTracks.length) % searchTracks.length
          );
          break;
        case "Enter":
          if (selectedIndex !== -1) {
            event.preventDefault();
            const selectedTrack = searchTracks[selectedIndex];
            window.open(
              `/tracks/${selectedTrack?.payload.trackId}/${selectedTrack?.payload.problemId}`,
              "_blank"
            );
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
      const selectedElement =
        scrollableContainerRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
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
      <div
        className="md:max-w-screen border border-primary/15 p-3 rounded-lg cursor-text w-full mx-auto"
        onClick={() => setDialogOpen(true)}
      >
        <div className="md:flex gap-2 items-center hidden justify-between ">
          <div className="flex gap-2 items-center">
            <MagnifyingGlassIcon className="size-4" />
            Search
          </div>
          <kbd className="bg-white/15 p-2 rounded-sm text-sm leading-3">
            Ctrl + K
          </kbd>
        </div>
        <div className="block md:hidden">
          <MagnifyingGlassIcon className="size-4" />
        </div>
      </div>
      <DialogContent className="p-0 gap-0 max-w-2xl">
        <div className="flex items-center px-6 py-4 border-b">
          <MagnifyingGlassIcon className="size-4" />
          <Input
            type="text"
            placeholder="Search"
            className="border-none focus-visible:outline-none focus-visible:ring-0 text-base shadow-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <DialogClose>
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div
          className="h-[400px] py-4 space-y-4 overflow-y-scroll"
          ref={scrollableContainerRef}
        >
          {searchTracks.length > 0 &&
            searchTracks.map((track, index) => (
              <div
                key={track.id}
                className={`p-2 ${
                  index === selectedIndex ? "bg-blue-600/20" : ""
                }`}
              >
                <Link
                  className="flex"
                  href={`/tracks/${track.item.id}`}
                  target="_blank"
                  passHref
                >
                  <Card className="p-2 w-full mx-2">
                    <div className="flex my-2">
                      <Image
                        alt={track.item.title}
                        src={track.item?.image}
                        className="flex mx-2 w-[110px] h-[110px] rounded-xl"
                        width={110}
                        height={110}
                      />

                      <div>
                        <CardHeader>
                          <CardTitle>{track.item.title}</CardTitle>
                          <CardDescription>
                            {track.item.description}
                          </CardDescription>
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
