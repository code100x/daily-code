"use client";
import Link from "next/link";
import { TrackCard } from "@repo/ui/components";
import { categories as stateCategories } from "@repo/store";
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
  const selectedCategory = useRecoilValue(stateCategories);
  const [filteredTracks, setFilteredTracks] = useState<Tracks[]>(tracks);

  useEffect(() => {
    filterTracks();
  }, [selectedCategory]);

  const filterTracks = () => {
    let filteredTracks = tracks;
    if (selectedCategory.length > 0) {
      filteredTracks = tracks.filter((t) => t.categories.some((c) => selectedCategory.includes(c.category.category)));
    }
    setFilteredTracks(filteredTracks);
  };

  return (
    <div>
      <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 place-items-center lg:grid-cols-2 w-full">
        {filteredTracks.map((t) => (
          <li key={t.id} className="max-w-screen-md w-full">
            {t.problems.length > 0 ? (
              <Link className="w-full" href={`/tracks/${t.id}/${t.problems[0]?.id}`}>
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
