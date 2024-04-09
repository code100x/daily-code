"use client";
import { ScrollArea } from "./shad/ui/scroll-area";
import { Track } from "@prisma/client";
import { Input } from "./shad/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./shad/ui/card";
import { Button } from "./shad/ui/button";
import LinkCard from "./LinkCard";

interface LinkProblemsProps extends Track {
  problems: {
    id: string;
    title: string;
    description: string;
    notionDocId: string;
    type: string;
  }[];
}

export const LinkProblems = ({ tracks }: { tracks: LinkProblemsProps[] }) => {
  const [search, setSearch] = useState("");
  const [filteredTracks, setFilteredTracks] = useState(tracks);

  useEffect(() => {
    setFilteredTracks(tracks.filter((track) => track.title.toLowerCase().includes(search.toLowerCase())));
  }, [search, tracks]);

  return (
    <div>
      <div className="flex justify-center">
        <MagnifyingGlassIcon className="relative left-6 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Tracks..."
          className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex justify-center">
        <ScrollArea className="w-2/3 h-screen m-2">
          <div className="space-y-4">
            {filteredTracks.map((track) => (
              <Card key={track.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{track.title}</CardTitle>
                    <LinkCard track={track} />
                  </div>
                  <CardDescription>{track.description}</CardDescription>
                  <CardDescription>{track.image}</CardDescription>
                </CardHeader>
                <CardContent>{`hidden: ${track.hidden}`}</CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
