"use client";
import Link from "next/link";
import { TrackCard } from "@repo/ui/components";
import { category } from "@repo/store";
import { Track, Problem } from "@prisma/client";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";

interface Tracks extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export const Tracks = ({ tracks }: { tracks: Tracks[] }) => {
  const selectedCategory = useRecoilValue(category);
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const filtereTracks = () => {
    let filteredTracks = tracks;
    if (selectedCategory.length > 0) {
      filteredTracks = filteredTracks.filter((t) => t.categories.some((c) => c.category.category === selectedCategory));
    }
    setFilteredTracks(filteredTracks);
  };
  useEffect(() => {
    filtereTracks();
  }, [selectedCategory]);
  return (
    <div>
      <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 place-items-center lg:grid-cols-2 w-full">
        {filteredTracks.map((t, i) => (
          <li key={t.id} className="max-w-screen-md w-full">
            {t.problems.length > 0 ? (
              <Link className="w-full" href={`/tracks/${t.id}/${t.problems[0]?.id}`}>
                <TrackCard track={t} index={filteredTracks.length - i} />
              </Link>
            ) : (
              <TrackCard track={t} index={filteredTracks.length - i} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
