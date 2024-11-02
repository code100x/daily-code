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
    <div className="flex flex-col lg:flex-row justify-evenly mx-14">
      <div className="lg:hidden">
        
      <AddTrackCard categories={categories}  />
      </div>
      <ScrollArea className="h-screen m-2">
      <div className="flex w-full justify-center lg:hidden py-8">
        <h1 className="text-3xl">Edit Track</h1>
      </div>
      <div className="space-y-4">
        {tracks.map((track, i) => (
        <EditTrackCard key={i} Track={track} categories={categories} />
        ))}
      </div>
      </ScrollArea>
      <div className="hidden lg:block lg:min-w-[512px]">
        
      <AddTrackCard categories={categories}  />
      </div>
    </div>
  );
};
