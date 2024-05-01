"use client";
import Link from "next/link";
import { TrackCard } from "@repo/ui/components";
import { category } from "@repo/store";
import { Track, Problem } from "@prisma/client";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

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
  
  const session = useSession()
  // @ts-ignore
  const userid =session.data?.user?.id

  const selectedCategory = useRecoilValue(category);
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const [bookmarkedTrackId, setbookmarkedTrackId] = useState([])
  const filtereTracks = () => {
    let filteredTracks = tracks;
    if (selectedCategory.length > 0) {
      filteredTracks = filteredTracks.filter((t) => t.categories.some((c) => c.category.category === selectedCategory));
    }
    setFilteredTracks(filteredTracks);
  };

  async function getBookMarkStatus(){
    const { data } = await axios.post("/api/getAllBookmarks", {
      userid: userid,
    });
    setbookmarkedTrackId(data.map(({track}:{track:string})=>track))
  }
  console.log(bookmarkedTrackId,"checking")
  useEffect(() => {
    getBookMarkStatus()
    filtereTracks();

  }, [selectedCategory]);
  return (
    <div>
      <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 place-items-center lg:grid-cols-2 w-full">
        {filteredTracks.map((t) => (
          <li key={t.id} className="max-w-screen-md w-full">
            {t.problems.length > 0 ? (
              <div className="max-w-screen-md w-full block">
                <TrackCard track={t} bookmarks={bookmarkedTrackId} />
              </div>
            ) : (
              <TrackCard track={t} bookmarks={bookmarkedTrackId} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
