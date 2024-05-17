import { useEffect, useState } from "react";
import { Card, CardDescription, CardTitle, Button, Input, Sheet, SheetContent, SheetTrigger } from "@repo/ui";
import { MCQQuestion, Problem } from "@prisma/client";
import { createMCQ, deleteMCQ, getAllMCQQuestion } from "../utils";
import EditMCQ from "../mcq/EditMCQ";

interface AdminAddMCQProps extends Problem {
  mcqQuestions: MCQQuestion[];
}

const AdminAddMCQ = ({ problem }: { problem: AdminAddMCQProps }) => {
  const [mcqs, setMcqs] = useState<Omit<MCQQuestion, "id">[]>([]);
  const [ExistingMCQs, setExistingMCQs] = useState<MCQQuestion[]>(problem.mcqQuestions);
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [option, setoption] = useState<string>("");
  const [correctOption, setCorrectOption] = useState<string>("");
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  useEffect(() => {
    async function fetchMCQs() {
      const mcqs = await getAllMCQQuestion(problem.id);
      setExistingMCQs(mcqs);
    }
    fetchMCQs();
  }, [mcqs, isUpdate]);

  function handleAddOption() {
    setOptions([...options, ...option.split(",")]);
    setoption("");
  }
  function handleRemoveOption(option: string) {
    setOptions(options.filter((o) => o !== option));
  }
  function handleAddMCQ() {
    const data = {
      question: question,
      options: options,
      correctOption: correctOption,
      problemId: problem.id,
    };
    setMcqs([...mcqs, data]);
    setQuestion("");
    setOptions([]);
    setoption("");
    setCorrectOption("");
  }
  function handleRemoveMCQ(question: string) {
    setMcqs(mcqs.filter((mcq) => mcq.question !== question));
  }

  function handleSubmit() {
    mcqs.map(async (mcq) => {
      await createMCQ(mcq);
    });
    setMcqs([]);
  }

  function handleRemoveExistingMCQs(id: string) {
    deleteMCQ(id);
    setExistingMCQs(ExistingMCQs.filter((mcq) => mcq.id !== id));
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"outline"}> Add MCQ </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="h-4/5 overflow-y-auto">
        <div className="text-5xl text-center mb-4">MCQ</div>
        <div className="flex justify-center my-4 space-x-4">
          <Input
            placeholder="Question"
            value={question}
            className="w-1/3"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="flex w-1/3 space-x-4">
            <Input placeholder="Option" className="" value={option} onChange={(e) => setoption(e.target.value)} />
            <Button onClick={handleAddOption}>Add Option</Button>
          </div>
        </div>

        <div className="text-2xl text-center mb-4">Question</div>
        <div className="text-2xl text-center mb-4">{question}</div>
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
        {question && options.length > 1 && correctOption && (
          <div className="flex justify-center mt-4">
            <Button onClick={handleAddMCQ}>Add MCQ</Button>
          </div>
        )}
        <div>
          {mcqs?.map((mcq, i) => (
            <Card key={i} className="m-4 p-4 flex justify-between">
              <div>
                <CardTitle>{mcq.question}</CardTitle>
                <CardDescription>{mcq.options.join(", ")}</CardDescription>
                <CardDescription>Correct Option: {mcq.correctOption}</CardDescription>
              </div>
              <Button variant={"outline"} onClick={() => handleRemoveMCQ(mcq.question)}>
                Remove
              </Button>
            </Card>
          ))}
        </div>
        {mcqs.length > 0 && (
          <div className="flex justify-center">
            <Button onClick={() => handleSubmit()}>Add MCQs to DB</Button>
          </div>
        )}
        <div className="text-2xl text-center mb-4">Existing MCQ</div>
        {ExistingMCQs?.map((mcq, i) => (
          <Card key={i} className="m-4 p-4 flex justify-between">
            <div>
              <CardDescription>{mcq.id}</CardDescription>
              <CardTitle>{mcq.question}</CardTitle>
              <CardDescription>{mcq.options.join(", ")}</CardDescription>
              <CardDescription>Correct Option: {mcq.correctOption}</CardDescription>
            </div>
            <div className="space-x-3">
              <EditMCQ mcq={mcq} setIsUpdate={setIsUpdate} />
              <Button variant={"outline"} onClick={() => handleRemoveExistingMCQs(mcq.id)}>
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </SheetContent>
    </Sheet>
  );
};

export default AdminAddMCQ;
