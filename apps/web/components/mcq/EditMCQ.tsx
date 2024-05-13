import { MCQQuestion } from "@prisma/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Card,
  CardTitle,
  Button,
} from "@repo/ui";
import { Dispatch, SetStateAction, useState } from "react";
import { updateMCQ } from "../utils";

const EditMCQ = ({ mcq, setIsUpdate }: { mcq: MCQQuestion; setIsUpdate: Dispatch<SetStateAction<boolean>> }) => {
  const [question, setQuestion] = useState<string>(mcq.question);
  const [option, setOption] = useState<string>("");
  const [correctOption, setCorrectOption] = useState<string>(mcq.correctOption);
  const [options, setOptions] = useState<string[]>(mcq.options);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  function handleAddOption() {
    setOptions([...options, ...option.split(",")]);
    setOption("");
  }

  function handleRemoveOption(option: string) {
    setOptions(options.filter((o) => o !== option));
  }

  function handleUpdate() {
    const asyncUpdate = async () => {
      setIsUpdating(true);
      await updateMCQ(mcq.id, {
        id: mcq.id,
        question,
        options,
        correctOption,
        problemId: mcq.problemId,
      });
      setIsUpdating(false);
    };
    asyncUpdate();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="min-w-full">
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-center my-4 space-x-4">
              <Input
                placeholder="Question"
                value={question}
                className="w-1/3"
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div className="flex w-1/3 space-x-4">
                <Input placeholder="Option" value={option} onChange={(e) => setOption(e.target.value)} />
                <Button onClick={() => handleAddOption()}>Add Option</Button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 justify-center">
          {options.map((op, i) => (
            <Card key={i} className={"m-4 p-4 flex justify-between " + (op == correctOption ? "border-green-400" : "")}>
              <CardTitle>{op}</CardTitle>
              <div className="flex space-x-3">
                <Button variant={"outline"} onClick={() => handleRemoveOption(op)}>
                  Remove
                </Button>
                <Button variant={"outline"} onClick={() => setCorrectOption(op)}>
                  Correct Option
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => setIsUpdate((prev) => !prev)}>
              Close
            </Button>
          </DialogClose>
          <Button variant="secondary" onClick={handleUpdate}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMCQ;
