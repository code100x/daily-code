import { useState } from "react";
import { Input } from "./shad/ui/input";
import { Button } from ".";
import { Card } from "./shad/ui/card";
import { useToast } from "./shad/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";

export const TracksEditor = () => {
  const [notionLink, setNotionLink] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Blog");
  const [status, setStatus] = useState("");
  const { toast } = useToast();

  const addTrackWithNotion = async (link, description, image) => {
    const response = await fetch(
      "/api/createTrack?" +
        new URLSearchParams({
          link,
          description,
          image,
          type,
        }),
      {
        method: "POST",
      }
    );
    const data = await response.json();
    return data;
  };

  const clearAfterTrackAddition = () => {
    setNotionLink("");
    setImageLink("");
    setDescription("");
  };

  return (
    <div className="grid grid-cols-2">
      <Card className="cols-span-4 p-4 w-full">
        <Select
          onValueChange={(e) => {
            setType(e);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" defaultValue={type} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Blog">Blog</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Notion Link"
          onChange={(event) => {
            setNotionLink(event.target.value);
          }}
          value={notionLink}
        />
        <Input
          type="text"
          placeholder="Description"
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          value={description}
        />
        <Input
          type="text"
          placeholder="Image Link"
          onChange={(event) => {
            setImageLink(event.target.value);
          }}
          value={imageLink}
        />
        <Button
          disabled={!description || !type || !notionLink || !imageLink}
          onClick={async () => {
            setStatus("Adding to Database...");
            await addTrackWithNotion(notionLink, description, imageLink);
            toast({
              title: "Added to Tracks",
              className: "bg-primary text-white dark:text-black",
              description: "Notion Document Successfully added to the Tracks",
            });
            setStatus("Added to the Database Successfully!");
            clearAfterTrackAddition();
            setTimeout(() => setStatus(""), 3000);
          }}
        >
          Add
        </Button>
        <br />
        {status && <span>{status}</span>}
      </Card>
    </div>
  );
};
