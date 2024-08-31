"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Dialog, DialogClose, DialogContent, Button, Input, Card, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { useEffect, useRef, useState } from "react";
import { Track, Problem } from "@prisma/client";
import Fuse from "fuse.js";
import Link from "next/link";

declare global {
  interface Window {
    SpeechRecognition: any;
  }
}

export function ContentSearch({ tracks }: { tracks: (Track & { problems: Problem[] })[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [searchTracks, setSearchTracks] = useState<(Track & { problems: Problem[] })[]>(tracks);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [shortcut, setShortcut] = useState("Ctrl K");
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef<any | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = false; 
      speechRecognitionRef.current.interimResults = false; 
      speechRecognitionRef.current.lang = 'en-US'; 

      speechRecognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); 
        setIsListening(false); 
      };

      speechRecognitionRef.current.onstart = () => setIsListening(true);
      speechRecognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const startListening = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.start();
    }
  };

  const endListening = () =>{
    if(speechRecognitionRef.current){
      speechRecognitionRef.current.stop();
    }
  }

  useEffect(() => {
    const fuse = new Fuse(tracks, {
      keys: ["title", "description"],
    });

    if (input.length > 0) {
      const result = fuse.search(input);
      setSearchTracks(result.map(({ item }) => item));
    } else {
      setSearchTracks(tracks);
    }
    setSelectedIndex(-1);
  }, [input, tracks]);

  useEffect(() => {
    const isMacOS = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    setShortcut(isMacOS ? "Cmd + K" : "Ctrl + K");
  }, []);

  function handleClose(open: boolean) {
    if (!open) setDialogOpen(false);
    setInput("");
    endListening();
  }

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
            window.open(`/tracks/${selectedTrack?.id}/${selectedTrack?.id}`, "_blank");
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

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <div
        className="md:max-w-screen border border-primary/15 p-3 rounded-lg cursor-text w-full mx-auto"
        onClick={() => setDialogOpen(true)}
      >
        <div className="md:flex gap-2 items-center hidden justify-between">
          <div className="flex gap-2 items-center">
            <MagnifyingGlassIcon className="size-4" />
            Search
          </div>
          <kbd className="bg-white/15 p-2 rounded-sm text-sm leading-3">{shortcut}</kbd>
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
          <button onClick={isListening ? endListening : startListening}>
            <div className={`h-8 w-8 mr-2 ${isListening ? `bg-red-600` : `bg-black`} rounded-full flex items-center justify-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 304 408">
                <path fill="white" d="M149.5 259q-26.5 0-45.5-19t-19-45V67q0-27 19-45.5T149.5 3t45 18.5T213 67v128q0 26-18.5 45t-45 19zM262 195h37q0 54-37.5 94.5T171 338v70h-43v-70q-53-8-90.5-49T0 195h36q0 46 34 77t79.5 31t79-31t33.5-77z" />
              </svg>
            </div>
          </button>
          <DialogClose>
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="h-[400px] py-4 space-y-4 overflow-y-scroll" ref={scrollableContainerRef}>
          {searchTracks.length > 0 &&
            searchTracks.map((track, index) => (
              <div key={track.id} className={`p-2 ${index === selectedIndex ? "bg-blue-600/20" : ""}`}>
                <Link
                  className="flex"
                  href={`/tracks/${track.id}`}
                  target="_blank"
                  passHref
                >
                  <Card className="p-2 w-full mx-2">
                    <div className="flex my-2">
                      <img
                        alt={track.title}
                        src={track.image}
                        className="flex mx-2 w-1/6 h-1/6 rounded-xl"
                      />
                      <div>
                        <CardHeader>
                          <CardTitle>{track.title}</CardTitle>
                          <CardDescription>{track.description}</CardDescription>
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
