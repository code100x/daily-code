"use client";
import Link from "next/link";
import { TrackCard } from "@repo/ui/components";
import { Track, category } from "../../store/src/atoms";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";

export const Tracks = ({ tracks }: { tracks: Track[] }) => {
  const selectedCategory = useRecoilValue(category);
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const filtereTracks = () => {
    let filteredTracks = tracks;
    if (selectedCategory.length > 0) {
      filteredTracks = filteredTracks.filter((t) => t.category == selectedCategory);
    }
    setFilteredTracks(filteredTracks);
  };
  useEffect(() => {
    filtereTracks();
  }, [selectedCategory]);
  return (
    <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2">
      {filteredTracks.map((t) => (
        <li key={t.id}>
          <Link className="max-w-screen-md w-full" href={`/tracks/${t.id}`}>
            <TrackCard track={t} />
          </Link>
        </li>
      ))}
    </ul>
  );
};
