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
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@repo/ui";
import { TrackPros } from "./Tracks";

type Payload = {
  problemId: string;
  trackTitle: string;
  problemTitle: string;
  trackId: string;
  image: string;
};

interface DataItem {
  payload: Payload;
}

export function ContentSearch({ tracks }: { tracks: TrackPros[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [searchTracks, setSearchTracks] = useState<DataItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const deferredInput = useDeferredValue(input);
  const [allTracks, setAllTracks] = useState<DataItem[]>([]);
  // By default filter type
  const [searchType, setSearchType] = useState("trackTitle");

  useEffect(() => {
    const updatedTracks: DataItem[] = [];
    tracks.map((t) => {
      t.problems.map((p) => {
        updatedTracks.push({
          payload: {
            problemId: p.id,
            trackTitle: t.title,
            problemTitle: p.title,
            trackId: t.id,
            image: t.image,
          },
        });
      });
    });
    setAllTracks(updatedTracks);
  }, [tracks]);

  // FILTERING LOGIC BASED ON SEARCH TYPE
  useEffect(() => {
    if (deferredInput.length > 0) {
      const filteredTracks = allTracks.filter((track) => {
        if (searchType === "trackTitle") {
          return track.payload.problemTitle.toLowerCase().startsWith(deferredInput.toLowerCase());
        } else if (searchType === "problemTitle") {
          return track.payload.trackTitle.toLowerCase().includes(deferredInput.toLowerCase());
        }
        // ADD BASED ON TAG BY RECIEVING MORE DATA FROM PROPS IF YOU LIKE
        return false;
      });
      setSearchTracks(filteredTracks);
    } else {
      setSearchTracks([]);
    }
  }, [deferredInput, allTracks, searchType]);

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
      <div
        className="md:max-w-screen border-primary/15 mx-auto w-full cursor-text rounded-lg border p-3"
        onClick={() => setDialogOpen(true)}
      >
        <div className="hidden items-center justify-between gap-2 md:flex">
          <div className="flex items-center gap-2">
            <MagnifyingGlassIcon className="size-4" />
            Search
          </div>
          <kbd className="rounded-sm bg-white/15 p-2 text-sm leading-3">Ctrl + K</kbd>
        </div>
        <div className="block md:hidden">
          <MagnifyingGlassIcon className="size-4" />
        </div>
      </div>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <div className="flex items-center border-b px-6 py-4">
          <MagnifyingGlassIcon className="size-4" />
          <Input
            type="text"
            placeholder="Search"
            className="border-none text-base shadow-none focus-visible:outline-none focus-visible:ring-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Select onValueChange={setSearchType}>
            {" "}
            {/* Handle filter selection */}
            <SelectTrigger className="mx-5 w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Search by Keywords</SelectLabel>
                <SelectItem value="trackTitle">Title</SelectItem>
                <SelectItem value="problemTitle">Description</SelectItem>
                {/* ADD SELECT ITEMS IF YOU LIKE */}
              </SelectGroup>
            </SelectContent>
          </Select>

          <DialogClose>
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="h-[400px] space-y-4 overflow-y-scroll py-4" ref={scrollableContainerRef}>
          {searchTracks.length > 0 &&
            searchTracks.map((track, index) => (
              <div key={track.payload.problemId} className={`p-2 ${index === selectedIndex ? "bg-blue-600/20" : ""}`}>
                <Link
                  className="flex"
                  href={`/tracks/${track.payload.trackId}/${track.payload.problemId}`}
                  target="_blank"
                  passHref
                >
                  <Card className="mx-2 w-full p-2">
                    <div className="my-2 flex">
                      <img
                        alt={track.payload.problemTitle}
                        src={track.payload.image}
                        className="mx-2 flex w-1/6 rounded-xl"
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
