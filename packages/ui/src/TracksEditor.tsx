import AddTrackCard from "./AddTrackCard";
import { ScrollArea } from "./shad/ui/scroll-area";
import { Track } from "@prisma/client";
import EditTrackCard from "./EditTrackCard";

export const TracksEditor = async ({ tracks }: { tracks: Track[] }) => {
  return (
    <div className="grid grid-cols-2">
      <ScrollArea className="h-screen m-2">
        <div className="space-y-4">
          {tracks.map((track, i) => (
            <EditTrackCard key={i} Track={track} />
          ))}
        </div>
      </ScrollArea>
      <AddTrackCard />
    </div>
  );
};
