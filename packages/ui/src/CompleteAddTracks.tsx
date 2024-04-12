"use client";
import { use, useEffect, useState } from "react";
import { Input } from "./shad/ui/input";
import { Button } from "./shad/ui/button";
import CompleteTrackCard from "./CompleteTrackCard";

interface CompleteTrack {
  trackId: string;
  trackTitle: string;
  trackDescription: string;
  trackImage: string;
}

const CompleteAddTracks = () => {
  const [notionId, setNotionId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [trackTitle, setTrackTitle] = useState("");
  const [trackDescription, setTrackDescription] = useState("");
  const [trackImage, setTrackImage] = useState("");
  const [trackData, setTrackData] = useState<CompleteTrack>({} as CompleteTrack);
  useEffect(() => {
    setTrackData({ trackId, trackDescription, trackTitle, trackImage });
  }, [trackId, trackDescription, trackTitle, trackImage]);
  return (
    <div className="flex flex-col justify-center">
      <div className="text-5xl text-center mb-4">Track</div>
      <div className="flex flex-col space-y-5 justify-center my-4">
        <div className="flex justify-center">
          <div className="mr-3">{"TrackId: "}</div>
          <Input className="w-1/3 mr-3" onChange={(e) => setTrackId(e.target.value)} placeholder="TrackId" />
        </div>
        <div className="flex justify-center">
          <div className="mr-3">{"TrackTitle: "}</div>
          <Input className="w-1/3 mr-3" onChange={(e) => setTrackTitle(e.target.value)} placeholder="TrackTitle" />
        </div>
        <div className="flex justify-center">
          <div className="mr-3">{"Description: "}</div>
          <Input
            className="w-1/3 mr-3"
            onChange={(e) => setTrackDescription(e.target.value)}
            placeholder="TrackDescription"
          />
        </div>
        <div className="flex justify-center">
          <div className="mr-3">{"TrackImage: "}</div>
          <Input className="w-1/3 mr-3" onChange={(e) => setTrackImage(e.target.value)} placeholder="TrackImage" />
        </div>
        <div className="flex justify-center">
          <div className="mr-3">{"NotionId: "}</div>
          <Input className="w-1/3 mr-3" onChange={(e) => setNotionId(e.target.value)} placeholder="NotionId" />
        </div>
        <div className="flex justify-center">
          <CompleteTrackCard notionId={notionId} TrackData={trackData} />
        </div>
      </div>
    </div>
  );
};

export default CompleteAddTracks;
