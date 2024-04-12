import { useState } from "react";
import { Input } from "./shad/ui/input";
import { Button } from ".";
import { Card } from "./shad/ui/card";
import { AddTrack } from "../../../apps/web/types";
import axios from "axios";
import toast from "react-hot-toast";

export const TracksEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [notion, setNotionurl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const newtrack: AddTrack = {
      title: title,
      description: description,
      imageUrl: image,
      notionUrl: notion,
    };
    try {
      setIsLoading(true);
      const response = await axios.post("/api/tracks/createtrack", { newtrack });
      if (response.data.success) {
        setTitle("");
        setDescription("");
        setImage("");
        setNotionurl("");
        toast.success("Track added successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add track. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2">
      <Card className="cols-span-4 p-4 w-full">
        <Input type="text" placeholder="Track title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <Input type="text" placeholder="Image URL" value={image} onChange={(event) => setImage(event.target.value)} />
        <Input
          type="text"
          placeholder="Notion URL"
          value={notion}
          onChange={(event) => setNotionurl(event.target.value)}
        />
        <Button disabled={!title || !description || !image || !notion || isLoading} onClick={handleSubmit}>
          {isLoading ? "Adding..." : "Add"}
        </Button>
        {isLoading && <div>Loading...</div>}
      </Card>
    </div>
  );
};
