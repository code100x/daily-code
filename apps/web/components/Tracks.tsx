"use client";

import { TrackCard } from "./TrackCard";
import { category } from "@repo/store";
import { Track, Problem } from "@prisma/client";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@repo/ui";

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
  const [filteredTracks, setFilteredTracks] = useState<Tracks[]>(tracks);
  const [sortBy, setSortBy] = useState<string>("");
  
  const filterTracks = () => {
    let filteredTracks = tracks;
    if (selectedCategory.length > 0) {
      filteredTracks = filteredTracks.filter((t) => t.categories.some((c) => c.category.category === selectedCategory));
    }
    setFilteredTracks(filteredTracks);
  };
  const sortTracks = (sortBy: string) => {
    let sortedTracks = [...filteredTracks];
    if (sortBy === "ascending") {
      sortedTracks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "descending") {
      sortedTracks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "new") {
      sortedTracks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "old") {
      sortedTracks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    setFilteredTracks(sortedTracks);
  };
  useEffect(() => {
    filterTracks();
  }, [selectedCategory]);
  useEffect(() => {
    sortTracks(sortBy);
  }, [sortBy]);
  return (
    <div>
      <Select
        onValueChange={(e) => {
          setSortBy(e);
        }}
      >
        <SelectTrigger className="w-[250px] mx-auto mt-6">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent
        ref={(ref)=>{
          if(!ref) return;
          ref.ontouchstart = (e)=>{
            e.preventDefault();
          }
        }}>
          <SelectGroup>
            <SelectItem value="ascending">Ascending (A to Z)</SelectItem>
            <SelectItem value="descending">Descending (Z to A)</SelectItem>
            <SelectItem value="new">Newest first</SelectItem>
            <SelectItem value="old">Oldest first</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 place-items-center lg:grid-cols-2 w-full">
        {filteredTracks.map((t) => (
          <li key={t.id} className="max-w-screen-md w-full">
                <TrackCard track={t} />
          </li>
        ))}
      </ul>
    </div>
  );
};
