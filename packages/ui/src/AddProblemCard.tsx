"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./shad/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";
import { Input } from "./shad/ui/input";
import { Button } from "./shad/ui/button";
import { useToast } from "./shad/ui/use-toast";
import { createProblem } from "../../../apps/web/components/utils";
import { useRouter } from "next/navigation";

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
  const [type, setType] = useState("Blog");
  const { toast } = useToast();
  const router = useRouter();

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
          onValueChange={(e) => {
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
            {problem.type === "Code" && (
              <CardFooter>
                <Button
                  onClick={() => {
                    router.push(`/admin/code/${problem.id}`);
                  }}
                >
                  Add Problem Statement
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddProblemCard;
