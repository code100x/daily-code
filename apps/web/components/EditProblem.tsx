"use client";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@repo/ui";

const EditProblem = ({ problem }: { problem: Prisma.ProblemCreateManyInput }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState<string | undefined>(problem.id);
  const [title, setTitle] = useState(problem.title);
  const [notionDocId, setNotionDocId] = useState(problem.notionDocId);
  function handleEdit() {
    if (isEditing) {
      return setIsEditing(false);
    }
    setIsEditing(true);
  }
  function handleDiscardButton() {
    setId(problem.id);
    setTitle(problem.title);
    setNotionDocId(problem.notionDocId);
    setIsEditing(false);
  }
  return (
    <Card key={problem.id}>
      {!isEditing && (
        <div>
          <CardHeader>
            <div className="flex justify-between">
              <div className="space-y-2">
                <CardTitle>{id}</CardTitle>
                <CardTitle>{title}</CardTitle>
              </div>
              <Button variant={"outline"} className="" onClick={() => handleEdit()}>
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>{notionDocId}</CardContent>
        </div>
      )}
      {isEditing && (
        <div>
          <CardHeader>
            <div className="flex justify-between">
              <div className="w-1/2 space-y-4">
                <CardTitle>
                  <Input onChange={(e) => setId(e.target.value)} value={id || ""} placeholder="ID" />
                </CardTitle>
                <CardTitle>
                  <Input onChange={(e) => setTitle(e.target.value)} value={title} placeholder="Title" />
                </CardTitle>
              </div>
              <div className="space-x-3">
                <Button variant={"outline"} className="" onClick={() => handleDiscardButton()}>
                  Discard
                </Button>
                <Button variant={"outline"} className="" onClick={() => handleEdit()}>
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Input onChange={(e) => setNotionDocId(e.target.value)} value={notionDocId} />
          </CardContent>
        </div>
      )}
    </Card>
  );
};

export default EditProblem;
