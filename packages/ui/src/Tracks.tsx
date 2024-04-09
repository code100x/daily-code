"use client";
import Link from "next/link";
import { TrackCard } from "@repo/ui/components";
import { category } from "@repo/store";
import { Track, Problem } from "@prisma/client";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";

interface Tracks extends Track {
  problems: Problem[];
  category: {
    category: string;
  }[];
}

export const Tracks = ({ tracks }: { tracks: Tracks[] }) => {
  const selectedCategory = useRecoilValue(category);
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const filtereTracks = () => {
    let filteredTracks = tracks;
    if (selectedCategory.length > 0) {
      filteredTracks = filteredTracks.filter((t) => t.category.some((c) => c.category === selectedCategory));
    }
    setFilteredTracks(filteredTracks);
  };
  useEffect(() => {
    filtereTracks();
  }, [selectedCategory]);
  return (
    <div>
      <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2">
        {filteredTracks.map((t) => (
          <li key={t.id}>
            {t.problems.length > 0 ? (
              <Link className="max-w-screen-md w-full" href={`/tracks/${t.id}/${t.problems[0]?.id}`}>
                <TrackCard track={t} />
              </Link>
            ) : (
              <TrackCard track={t} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
