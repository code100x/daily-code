"use client";
import { ScrollArea } from "./shad/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./shad/ui/card";
import { Button } from "./shad/ui/button";
import { Track } from "@prisma/client";
import { useState } from "react";
import { AddDatatoAlgolia } from "../../../apps/web/components/utils";

const AdminSearch = ({
  TracksinSearch,
  TracksNotinSearch,
}: {
  TracksinSearch: Track[];
  TracksNotinSearch: Track[];
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleAddTracks() {
    setIsSubmitting(true);
    for (const track of TracksNotinSearch) {
      await AddDatatoAlgolia({ trackId: track.id });
    }
    setIsSubmitting(false);
  }
  return (
    <div>
      <div className="flex justify-center">
        <Button disabled={isSubmitting} variant="outline" className="pr-2" onClick={handleAddTracks}>
          {!isSubmitting ? "Add Track" : "Adding Track to Search"}
        </Button>
      </div>
      <div className="grid grid-cols-2">
        <ScrollArea className="h-screen m-2">
          <div className="text-3xl text-center mb-4">Not in Search</div>
          <div className="space-y-4">
            {TracksNotinSearch.map((track, i) => (
              <Card key={track.id}>
                <div className="grid grid-cols-6">
                  <img
                    src={track.image}
                    className="flex m-4 min-h-[130px] sm:h-[130px] min-w-[130px] sm:w-[130px] rounded-xl"
                  />
                  <div className="col-span-5">
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>{track.title}</CardTitle>
                      </div>
                      <CardDescription>{track.description}</CardDescription>
                    </CardHeader>
                    <CardContent>{`hidden: ${track.hidden}`}</CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <ScrollArea className="h-screen m-2">
          <div className="text-3xl text-center mb-4">in Search</div>
          <div className="space-y-4">
            {TracksinSearch.map((track, i) => (
              <Card key={track.id}>
                <div className="grid grid-cols-6">
                  <img
                    src={track.image}
                    className="flex m-4 min-h-[130px] sm:h-[130px] min-w-[130px] sm:w-[130px] rounded-xl"
                  />
                  <div className="col-span-5">
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>{track.title}</CardTitle>
                      </div>
                      <CardDescription>{track.description}</CardDescription>
                    </CardHeader>
                    <CardContent>{`hidden: ${track.hidden}`}</CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminSearch;
