import { Problem } from "@prisma/client";
import { problem } from "@repo/store";
import { useSetRecoilState } from "recoil";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input, Label } from "@repo/ui/shad/ui";

export default function ProblemEditInput({ Lproblem }: { Lproblem: Problem }) {
  const setProblem = useSetRecoilState<Problem>(problem);

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
        <Select disabled>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Code">Code</SelectItem>
            <SelectItem value="Blog">Blog</SelectItem>
            <SelectItem value="MCQ">MCQ</SelectItem>
          </SelectContent>
        </Select>
      </Label>
    </div>
  );
}
