import AddTrackCard from "./AddTrackCard";
import { ScrollArea } from "./shad/ui/scroll-area";
import { getAllTracks } from "../../../apps/web/components/utils";
import EditTrackCard from "./EditTrackCard";
export const TracksEditor = async () => {
  const tracks = await getAllTracks();
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
