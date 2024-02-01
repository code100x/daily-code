import { useState } from "react";
import { Input } from "./shad/ui/input";
import { Button } from ".";
import { Card } from "./shad/ui/card";
import { getFunction } from "@repo/common";
import { useToast } from "./shad/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";

export const ProblemEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notionDocId, setNotionDocId] = useState("");
  const [type, setType] = useState("code");
  const addProblemFn = getFunction("addProblem");
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-2">
      <div></div>
      <Card className="cols-span-4 p-4 w-full">
        <Select
          onValueChange={(e) => {
            setType(e);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="blog">Blog</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Problem title"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="Description"
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="problem title"
          onChange={(event) => {
            setNotionDocId(event.target.value);
          }}
        />
        <Button
          disabled={!title || !description || !type || !notionDocId}
          onClick={async () => {
            await addProblemFn({
              title,
              description,
              type,
              notionDocId,
            });
            toast({
              title: "Added problem",
              description: "Problem added",
            });
          }}
        >
          Add
        </Button>
      </Card>
    </div>
  );
};
