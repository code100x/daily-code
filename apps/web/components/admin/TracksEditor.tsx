import AddTrackCard from "./AddTrackCard";
import { ScrollArea } from "@repo/ui";
import { Track } from "@prisma/client";
import EditTrackCard from "./EditTrackCard";
import { getAllCategories } from "../utils";

interface TrackCardProps extends Track {
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export const TracksEditor = async ({ tracks }: { tracks: TrackCardProps[] }) => {
  const categories = await getAllCategories();
  return (
    <div className="grid grid-cols-2">
      <ScrollArea className="h-screen m-2">
        <div className="space-y-4">
          {tracks.map((track, i) => (
            <EditTrackCard key={i} Track={track} categories={categories} />
          ))}
        </div>
      </ScrollArea>
      <AddTrackCard categories={categories} />
    </div>
  );
};
