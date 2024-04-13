"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TrackCard } from "@repo/ui/components";
import { category } from "@repo/store";
import { Track, Problem } from "@prisma/client";
import { useRecoilValue } from "recoil";

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
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 10;

  const filterTracks = () => {
    let filteredTracks = tracks;
    if (selectedCategory.length > 0) {
      filteredTracks = filteredTracks.filter((t) => t.categories.some((c) => c.category.category === selectedCategory));
    }
    return filteredTracks;
  };

  const totalTracks = filterTracks().length;
  const indexOfLastTrack = currentPage * tracksPerPage;
  const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
  const currentTracks = filterTracks().slice(indexOfFirstTrack, indexOfLastTrack);

  useEffect(() => {
    setCurrentPage(1); // Reset page number when category changes
  }, [selectedCategory]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 w-full">
        {currentTracks.map((t) => (
          <li key={t.id} className="flex justify-center">
            {t.problems.length > 0 ? (
              <Link className="max-w-screen-md w-full block" href={`/tracks/${t.id}/${t.problems[0]?.id}`}>
                <TrackCard track={t} />
              </Link>
            ) : (
              <TrackCard track={t} />
            )}
          </li>
        ))}
      </ul>
      {totalTracks > tracksPerPage && (
        <div className="flex justify-center py-4 mb-8">
          {Array.from({ length: Math.ceil(totalTracks / tracksPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${i + 1 === currentPage ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
