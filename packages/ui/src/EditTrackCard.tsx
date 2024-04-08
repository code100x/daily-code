"use client";
import { useState } from "react";
import { Button } from "./shad/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./shad/ui/card";
import { Track } from "@prisma/client";
import { Input } from "./shad/ui/input";
import { updateTrack } from "../../../apps/web/components/utils";

const EditTrackCard = ({ Track }: { Track: Track }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(Track.title);
  const [description, setDescription] = useState(Track.description);
  const [image, setImage] = useState(Track.image);
  const [hidden, setHidden] = useState(Track.hidden);
  function handleEdit(id: string) {
    if (isEditing) {
      updateTrack(id, { title, description, image, hidden });
      return setIsEditing(false);
    }
    setIsEditing(true);
  }
  function handleDiscardButton() {
    setTitle(Track.title);
    setDescription(Track.description);
    setImage(Track.image);
    setHidden(Track.hidden);
    setIsEditing(Track.hidden);
  }
  return (
    <Card key={Track.id}>
      {!isEditing && (
        <div>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>{title}</CardTitle>
              <Button variant={"outline"} className="" onClick={() => handleEdit(Track.id)}>
                Edit
              </Button>
            </div>
            <CardDescription>{description}</CardDescription>
            <CardDescription>{image}</CardDescription>
          </CardHeader>
          <CardContent>{`hidden: ${hidden}`}</CardContent>
        </div>
      )}
      {isEditing && (
        <div>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>
                <Input onChange={(e) => setTitle(e.target.value)} value={title} />
              </CardTitle>
              <div className="space-x-3">
                <Button variant={"outline"} className="" onClick={() => handleDiscardButton()}>
                  Discard
                </Button>
                <Button variant={"outline"} className="" onClick={() => handleEdit(Track.id)}>
                  Save
                </Button>
              </div>
            </div>
            <CardDescription>
              <Input onChange={(e) => setDescription(e.target.value)} value={description} />
            </CardDescription>
            <CardDescription>
              <Input onChange={(e) => setImage(e.target.value)} value={image} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input onChange={(e) => setHidden(!hidden)} value={`${hidden}`} />
          </CardContent>
        </div>
      )}
    </Card>
  );
};

export default EditTrackCard;
