"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./shad/ui/card";
import { Input } from "./shad/ui/input";
import { Button } from "./shad/ui/button";
import { useToast } from "./shad/ui/use-toast";
import { createTrack } from "../../../apps/web/components/utils";

interface Track {
  title: string;
  description: string;
  image: string;
  hidden: boolean;
}

const AddTrackCard = () => {
  const [newTracks, setNewProblems] = useState<Track[]>([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [hidden, setHidden] = useState(false);
  const { toast } = useToast();

  return (
    <div>
      <Card className="cols-span-4 p-4 m-2 w-full">
        <Input
          type="text"
          placeholder="Track Id"
          className="my-2"
          onChange={(event) => {
            setId(event.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="Track title"
          className="my-2"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="Track Description"
          className="my-2"
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="Image"
          className="my-2"
          onChange={(event) => {
            setImage(event.target.value);
          }}
        />
        <Button variant={"ghost"} onClick={() => setHidden(!hidden)}>
          {hidden ? "Hidden" : "Visible"}
        </Button>
        <Button
          disabled={!title || !description || !image}
          className="w-full mt-4"
          onClick={() => {
            createTrack({ id, title, description, image, hidden });
            newTracks.push({ title, description, image, hidden });
            toast({
              title: "Added a Track",
              description: "a new Track added",
            });
          }}
        >
          Add
        </Button>
      </Card>
      <div>
        {newTracks.map((Track, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{Track.title}</CardTitle>
              <CardDescription>{Track.description}</CardDescription>
              <CardDescription>{Track.image}</CardDescription>
            </CardHeader>
            <CardContent>{`Hidden: ${Track.hidden}`}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddTrackCard;
