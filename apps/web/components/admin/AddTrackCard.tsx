"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Button, useToast } from "@repo/ui";
import { createTrack } from "../utils";
import { Categories } from "@prisma/client";
import { Track } from "@prisma/client";

const AddTrackCard = ({ categories }: { categories: Categories[] }) => {
  const [newTracks, setNewProblems] = useState<Track[]>([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [hidden, setHidden] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const { toast } = useToast();

  function handleFilterButton(category: string) {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.filter((item) => item !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
  }

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
        <div className="flex lg:flex-row justify-evenly mx-auto py-1">
          {categories.map((category, i) => (
            <Button
              key={i}
              variant="ghost"
              onClick={() => handleFilterButton(category.id)}
              className={selectedCategory.includes(category.id) ? "bg-gray-100 dark:bg-slate-700" : ""}
            >
              {category.category}
            </Button>
          ))}
        </div>
        <Button variant={"ghost"} onClick={() => setHidden(!hidden)}>
          {hidden ? "Hidden" : "Visible"}
        </Button>
        <Button
          disabled={!title || !description || !image}
          className="w-full mt-4"
          onClick={async () => {
            await createTrack({ problems: [], id, title, description, image, hidden, selectedCategory });
            setNewProblems((prev) => [...prev, { id, title, description, image, hidden, createdAt: new Date() }]);
            toast({
              title: "Added a Track",
              description: "a new Track added",
            });
          }}
        >
          Add
        </Button>
      </Card>
      <div className="space-y-4">
        {newTracks.map((Track, i) => (
          <Card key={i}>
            <div className="grid grid-cols-6">
              <img
                src={Track.image}
                className="flex m-4 min-h-[130px] sm:h-[130px] min-w-[130px] sm:w-[130px] rounded-xl"
              />
              <div className="col-span-5">
                <CardHeader>
                  <CardTitle>{Track.title}</CardTitle>
                  <CardDescription>{Track.description}</CardDescription>
                </CardHeader>
                <CardContent>{`hidden: ${Track.hidden}`}</CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddTrackCard;
