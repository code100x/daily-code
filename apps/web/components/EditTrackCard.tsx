"use client";
import { useState } from "react";
import { Button } from "@repo/ui/shad/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/shad/ui";
import { Track,Categories } from "@prisma/client";
import { Input } from "@repo/ui/shad/ui";
import { updateTrack } from "../../../apps/web/components/utils";

interface TrackCardProps extends Track {
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

const EditTrackCard = ({ Track,categories }: { 
  Track: TrackCardProps 
  categories: Categories[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(Track.title);
  const [description, setDescription] = useState(Track.description);
  const [image, setImage] = useState(Track.image);
  const [hidden, setHidden] = useState(Track.hidden);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(Track.categories.map((item) => item.category.id));


  function handleEdit(id: string) {
    if (isEditing) {
      updateTrack(id, { id, title, description, image, hidden, selectedCategory});
      return setIsEditing(false);
    }
    setIsEditing(true);
  }

  function handleFilterButton(category: string) {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.filter((item) => item !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
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
        <div className="grid grid-cols-6">
          <img src={image} className="flex m-4 min-h-[130px] sm:h-[130px] min-w-[130px] sm:w-[130px] rounded-xl" />
          <div className="col-span-5">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{title}</CardTitle>
                <Button variant={"outline"} className="" onClick={() => handleEdit(Track.id)}>
                  Edit
                </Button>
              </div>
              <CardDescription>{description}</CardDescription>
              <CardDescription>
              {selectedCategory.map((item) => {
                return <div key={item}>{item}</div>;
              })}
            </CardDescription>
            </CardHeader>
            <CardContent>{`hidden: ${hidden}`}</CardContent>
          </div>
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
            <CardDescription>
              {categories.map((item,i) => (
                <Button
                key={i}
                variant="ghost"
                onClick={() => handleFilterButton(item.id)}
                className={selectedCategory.includes(item.id) ? "bg-gray-100 dark:bg-slate-700" : ""}
              >
                {item.category}
              </Button>
              ))}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={(e) => setHidden(!hidden)}>{`${hidden}`}</Button>
          </CardContent>
        </div>
      )}
    </Card>
  );
};

export default EditTrackCard;
