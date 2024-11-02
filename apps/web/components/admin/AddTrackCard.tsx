"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Button, useToast } from "@repo/ui";
import { createTrack } from "../utils";
import { Categories } from "@prisma/client";
import { Track } from "@prisma/client";

const AddTrackCard = ({ categories }: { categories: Categories[] }) => {
  const [newTracks, setNewProblems] = useState<Omit<Track, "inSearch">[]>([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [hidden, setHidden] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [cohort, setCohort] = useState(3);
  const [canvaLink, setCanvaLink] = useState("");
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
      <Card className="cols-span-4 m-2 w-full p-4">
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
        <Input
          type="number"
          placeholder="Cohort"
          className="my-2"
          value={cohort}
          onChange={(event) => {
            setCohort(parseInt(event.target.value));
          }}
        />
        <Input
          type="text"
          placeholder="Canva Link"
          className="my-2"
          value={canvaLink}
          onChange={(event) => {
            setCanvaLink(event.target.value);
          }}
        />
        <div className="mx-auto flex justify-evenly py-1 lg:flex-row">
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
          className="mt-4 w-full"
          onClick={async () => {
            await createTrack({
              problems: [],
              id,
              title,
              description,
              image,
              hidden,
              selectedCategory,
              canvaLink,
              trackType: canvaLink ? "CANVA" : "NOTION",
            });
            setNewProblems((prev) => [
              ...prev,
              {
                id,
                title,
                description,
                image,
                hidden,
                cohort,
                createdAt: new Date(),
                canvaLink,
                trackType: canvaLink ? "CANVA" : "NOTION",
              },
            ]);
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
                className="m-4 flex min-h-[130px] min-w-[130px] rounded-xl sm:h-[130px] sm:w-[130px]"
              />
              <div className="col-span-5">
                <CardHeader>
                  <CardTitle>{Track.title}</CardTitle>
                  <CardDescription>{Track.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {`hidden: ${Track.hidden}`}
                  {`Cohort: ${Track.cohort}`}
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddTrackCard;
