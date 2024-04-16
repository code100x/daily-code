import { Dispatch, SetStateAction } from "react";
import { Input } from "./shad/ui/input";
import { Label } from "./shad/ui/label";
import { Problem } from "@prisma/client";
export default function ProblemEditInput({
  setProblem,
  problem,
}: {
  problem: Problem;
  setProblem: Dispatch<SetStateAction<Problem>>;
}) {
  return (
    <>
      <Label className="text-xl">Problem:</Label>
      <Label className="grid grid-cols-4">
        <Label>Title:</Label>
        <Input
          key={"title"}
          value={problem.title}
          className="col-span-3"
          onChange={(e) => setProblem((prev: Problem) => ({ ...prev, title: e.target.value }))}
        />
        <Label>Description:</Label>
        <Input
          key={"description"}
          value={problem.description}
          className="col-span-3"
          onChange={(e) => setProblem((prev: Problem) => ({ ...prev, description: e.target.value }))}
        />
        <Label>Notion Doc ID:</Label>
        <Input
          key={"notionDocId"}
          value={problem.notionDocId}
          className="col-span-3"
          onChange={(e) => setProblem((prev: Problem) => ({ ...prev, notionDocId: e.target.value }))}
        />
        <Label>Type:</Label>
        <Input
          key={"problemtype"}
          value={problem.type}
          className="col-span-3"
          onChange={(e) => setProblem((prev: Problem) => ({ ...prev, type: e.target.value }))}
        />
      </Label>
    </>
  );
}
