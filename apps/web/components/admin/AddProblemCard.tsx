"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Button,
  useToast,
} from "@repo/ui";
import { ProblemType } from "@prisma/client";
import { createProblem } from "../utils";

interface Problem {
  id: string;
  title: string;
  description: string;
  type: string;
  notionDocId: string;
}

const AddProblemCard = () => {
  const [newProblems, setNewProblems] = useState<Problem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notionDocId, setNotionDocId] = useState("");
  const [type, setType] = useState<ProblemType>(ProblemType.Blog);
  const { toast } = useToast();

  const handleCreateProblem = async () => {
    const problem = await createProblem({ title, description, type, notionDocId });
    if (problem) {
      newProblems.push(problem);
      toast({
        title: "Added problem",
        description: "Problem added",
      });
      return;
    }

    toast({
      title: "Couldn't add problem",
      description: "Please try again later",
    });
  };

  return (
    <div>
      <Card className="cols-span-4 p-4 m-2 w-full">
        <Select
          onValueChange={(e: ProblemType) => {
            setType(e);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ProblemType.Blog}>Blog</SelectItem>
            <SelectItem value={ProblemType.MCQ}>MCQ</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Problem title"
          className="my-2"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="Description"
          className="my-2"
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="NotionDocId"
          className="my-2"
          onChange={(event) => {
            setNotionDocId(event.target.value);
          }}
        />
        <Button
          disabled={!title || !description || !type || !notionDocId}
          className="w-full mt-4"
          onClick={handleCreateProblem}
        >
          Add
        </Button>
      </Card>
      <div>
        {newProblems.map((problem, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{problem.title}</CardTitle>
              <CardDescription>{problem.description}</CardDescription>
              <CardDescription>{problem.type}</CardDescription>
            </CardHeader>
            <CardContent>{problem.notionDocId}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddProblemCard;
