"use client";
import { Button } from "@repo/ui";
import { TrackProblems, Track } from "@prisma/client";
import { Input } from "@repo/ui";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui";
import ProblemCard from "./ProblemCard";
import { useState } from "react";
import { createTrackProblems } from "../utils";
import { Card, CardDescription, CardTitle } from "@repo/ui";

interface LinkCardProps extends Track {
  problems: {
    id: string;
    title: string;
    description: string;
    notionDocId: string;
    type: string;
  }[];
}

const LinkCard = ({ track }: { track: LinkCardProps }) => {
  function handleAddProblem() {
    try {
      createTrackProblems({ trackId: track.id, problemId, sortingOrder });
    } catch (error) {
      console.error(error);
    }
  }
  const [problemId, setProblemId] = useState("");
  const [sortingOrder, setSortingOrder] = useState(0);
  const [newProblems, setNewProblems] = useState<TrackProblems[]>([]);
  const problems = track.problems;
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"outline"}>View</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="h-4/5 overflow-y-auto">
        <div className="text-5xl text-center mb-4">Problems</div>
        <div className="flex justify-center my-4">
          <div className="flex items-center mr-3">{"ProblemId: "}</div>
          <Input className="w-1/3" onChange={(e) => setProblemId(e.target.value)} />
          <div className="flex items-center mx-3">{"SortingOrder: "}</div>
          <Input type="number" className="w-24 mx-2" onChange={(e) => setSortingOrder(parseInt(e.target.value))} />
          <Button
            className="ml-3"
            onClick={() => {
              handleAddProblem();
              setNewProblems([...newProblems, { trackId: track.id, problemId, sortingOrder }]);
            }}
          >
            Add
          </Button>
        </div>
        {newProblems[0] && <div className="text-2xl text-center mb-4">New Problems</div>}
        <div className="flex">
          {newProblems.map((problem, i) => (
            <Card className="m-4 p-4" key={i}>
              <CardTitle>problemId: {problem.problemId}</CardTitle>
              <CardDescription>sortingOrder: {problem.sortingOrder}</CardDescription>
            </Card>
          ))}
        </div>
        <div className="text-2xl text-center mb-4">Existing Problems</div>
        <div className="space-y-4">
          {problems.map((problem, i) => (
            // @ts-ignore
            <ProblemCard key={i} problem={problem} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LinkCard;
