"use client";
import { useEffect, useState } from "react";
import { Input, Button } from "@repo/ui";
import { Categories } from "@prisma/client";
import CompleteTrackCard from "./CompleteTrackCard";
import EditCategories from "./EditCategories";

export interface CompleteTrack {
  trackId: string;
  trackTitle: string;
  trackDescription: string;
  trackImage: string;
  selectedCategory: string[];
  cohort: string;
  canvaLink?: string | undefined;
  trackType: "NOTION" | "CANVA";
}

const CompleteAddTracks = ({ categories }: { categories: Categories[] }) => {
  const [notionId, setNotionId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [trackTitle, setTrackTitle] = useState("");
  const [trackDescription, setTrackDescription] = useState("");
  const [trackImage, setTrackImage] = useState("");
  const [cohort, setCohort] = useState<string>("3");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [trackData, setTrackData] = useState<CompleteTrack>({} as CompleteTrack);

  function handleFilterButton(category: string) {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.filter((item) => item !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
  }

  useEffect(() => {
    setTrackData({
      trackId,
      trackDescription,
      trackTitle,
      trackImage,
      selectedCategory,
      cohort,
      canvaLink: undefined,
      trackType: "NOTION",
    });
  }, [trackId, trackDescription, trackTitle, trackImage, selectedCategory]);
  return (
    <div className="flex flex-col justify-center">
      <div className="mb-4 text-center text-5xl">Track</div>
      <div className="my-4 flex flex-col justify-center space-y-5">
        <div className="flex justify-center items-center">
          <div className="mr-3 min-w-[100px]">{"TrackId: "}</div>
          <Input className="mr-3 w-1/3" onChange={(e) => setTrackId(e.target.value)} placeholder="TrackId" />
        </div>
        <div className="flex justify-center">
          <div className="mr-3 min-w-[100px]">{"TrackTitle: "}</div>
          <Input className="mr-3 w-1/3" onChange={(e) => setTrackTitle(e.target.value)} placeholder="TrackTitle" />
        </div>
        <div className="flex justify-center">
          <div className="mr-3 min-w-[100px]">{"Description: "}</div>
          <Input
            className="mr-3 w-1/3"
            onChange={(e) => setTrackDescription(e.target.value)}
            placeholder="TrackDescription"
          />
        </div>
        <div className="flex justify-center">
          <div className="mr-3 min-w-[100px]">{"TrackImage: "}</div>
          <Input className="mr-3 w-1/3" onChange={(e) => setTrackImage(e.target.value)} placeholder="TrackImage" />
        </div>
        <div className="flex justify-center">
          <div className="mr-3 min-w-[100px]">{"NotionId: "}</div>
          <Input className="mr-3 w-1/3" onChange={(e) => setNotionId(e.target.value)} placeholder="NotionId" />
        </div>
        <div className="flex justify-center">
          <div className="mr-3 min-w-[100px]">{"Cohort: "}</div>
          <Input
            className="mr-3 w-1/3"
            type="number"
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            placeholder="3"
          />
        </div>

        <div className="px-14">
        <div className="mx-auto flex flex-wrap justify-center gap-2 py-1">
          {categories.map((category, i) => (
            <Button
              key={i}
              variant="ghost"
              onClick={() => handleFilterButton(category.id)}
              className={selectedCategory.includes(category.id) ? "bg-gray-100 dark:bg-slate-700" : ""}
            >
              {category.category}
            </Button>
          ))}
          <EditCategories categories={categories} />
        </div>
        </div>

        <div className="flex justify-center">
          <CompleteTrackCard notionId={notionId} TrackData={trackData} />
        </div>
      </div>
    </div>
  );
};

export default CompleteAddTracks;
