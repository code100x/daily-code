"use client";
import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Problem, ProblemType } from "@prisma/client";
import { updateProblem } from "../utils";

const ProblemCard = ({ problem }: { problem: Problem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(problem.id);
  const [title, setTitle] = useState(problem.title);
  const [description, setDescription] = useState(problem.description);
  const [type, setType] = useState(problem.type);
  const [notionDocId, setNotionDocId] = useState(problem.notionDocId);
  function handleEdit(id: string) {
    if (isEditing) {
      updateProblem(problem.id, { id, title, description, type, notionDocId });
      return setIsEditing(false);
    }
    setIsEditing(true);
  }
  function handleDiscardButton() {
    setTitle(problem.title);
    setDescription(problem.description);
    setType(problem.type);
    setNotionDocId(problem.notionDocId);
    setIsEditing(false);
  }
  return (
    <Card key={problem.id}>
      {!isEditing && (
        <div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{id}</CardTitle>
                <CardTitle>{title}</CardTitle>
              </div>
              <div className="flex gap-4 items-center">
                <Button variant={"outline"} className="" onClick={() => handleEdit(problem.id)}>
                  Edit
                </Button>
              </div>
            </div>
            <CardDescription>{description}</CardDescription>
            <CardDescription>{type}</CardDescription>
          </CardHeader>
          <CardContent>{notionDocId}</CardContent>
        </div>
      )}
      {isEditing && (
        <div>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>
                  <Input onChange={(e) => setId(e.target.value)} value={id} />
                </CardTitle>
                <CardTitle>
                  <Input onChange={(e) => setTitle(e.target.value)} value={title} />
                </CardTitle>
              </div>
              <div className="space-x-3">
                <Button variant={"outline"} className="" onClick={() => handleDiscardButton()}>
                  Discard
                </Button>
                <Button variant={"outline"} className="" onClick={() => handleEdit(id)}>
                  Save
                </Button>
              </div>
            </div>
            <CardDescription>
              <Input onChange={(e) => setDescription(e.target.value)} value={description} />
            </CardDescription>
            <CardDescription>
              <Select
                onValueChange={(e: ProblemType) => {
                  setType(e);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Code">Code</SelectItem>
                  <SelectItem value="Blog">Blog</SelectItem>
                  <SelectItem value="MCQ">MCQ</SelectItem>
                </SelectContent>
              </Select>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input onChange={(e) => setNotionDocId(e.target.value)} value={notionDocId} />
          </CardContent>
        </div>
      )}
    </Card>
  );
};

export default ProblemCard;
