"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, ScrollArea, toast } from "@repo/ui";
import { Track } from "@prisma/client";
import { useState } from "react";
import { createCollection, insertData } from "../../lib/search";

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
      await insertData(track.id);
    }
    setIsSubmitting(false);
  }
  async function handlecreateCollection() {
    toast({
      title: "Creating Collection",
      description: "Please wait",
    });
    try {
      await createCollection();
      toast({
        title: "Collection Created",
        description: "Collection Created Successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error Creating Collection",
      });
    }
  }
  return (
    <div>
      <div className="flex justify-center space-x-3">
        <Button variant="outline" onClick={handlecreateCollection}>
          Create Collection
        </Button>
        <Button disabled={isSubmitting} variant="outline" onClick={handleAddTracks}>
          {!isSubmitting ? "Add Track" : "Adding Track to Search"}
        </Button>
      </div>
      <div className="grid md:grid-cols-2 px-14 grid-cols-1">
        <ScrollArea className="h-full m-2 pb-14">
          <div className="text-3xl text-center mb-4">Not in Search</div>
          <div className="space-y-4">
            {TracksNotinSearch.map((track, i) => (
              <Card className="w-full" key={track.id}>
                <div className="flex w-full">
                  <img
                    src={track.image}
                    className="flex m-4 size-[130px] rounded-xl"
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
              <Card className="w-full" key={track.id}>
                <div className="flex w-full">
                  <img
                    src={track.image}
                    className="flex m-4 size-[130px] rounded-xl"
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
