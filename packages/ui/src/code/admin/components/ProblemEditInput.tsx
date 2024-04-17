import { problem } from "@repo/store";
import { Input } from "../../../shad/ui/input";
import { Label } from "../../../shad/ui/label";
import { Problem } from "@prisma/client";
import { useRecoilState } from "recoil";
import { Dispatch, SetStateAction } from "react";

export default function ProblemEditInput() {
  const [Lproblem, setProblem]: [Problem, Dispatch<SetStateAction<Problem>>] = useRecoilState(problem);
  return (
    <div>
      <Label className="text-xl">Problem:</Label>
      <Label className="grid grid-cols-4">
        <Label>Title:</Label>
        <Input
          key={"title"}
          value={Lproblem.title}
          className="col-span-3"
          onChange={(e) => setProblem((prev: Problem) => ({ ...prev, title: e.target.value }))}
        />
        <Label>Description:</Label>
        <Input
          key={"description"}
          value={Lproblem.description}
          className="col-span-3"
          onChange={(e) => setProblem((prev: Problem) => ({ ...prev, description: e.target.value }))}
        />
        <Label>Notion Doc ID:</Label>
        <Input
          key={"notionDocId"}
          value={Lproblem.notionDocId}
          className="col-span-3"
          onChange={(e) => setProblem((prev: Problem) => ({ ...prev, notionDocId: e.target.value }))}
        />
        <Label>Type:</Label>
        <Input
          key={"problemtype"}
          value={Lproblem.type}
          className="col-span-3"
          onChange={(e) => setProblem((prev: Problem) => ({ ...prev, type: e.target.value }))}
        />
      </Label>
    </div>
  );
}
