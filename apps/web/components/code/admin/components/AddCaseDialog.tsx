import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  useToast,
} from "@repo/ui";
import { useState } from "react";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { createProblem, createProblemStatement, createTestCase } from "../../../utils";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { CodeLanguage, ProblemStatement } from "prisma/prisma-client";
import {
  problemId,
  argumentNames,
  problemStatementId,
  problemStatementsAtom,
  mainFuncName,
  globalLanguagesSupported,
  languagesSupported,
  problem,
  testCases,
} from "@repo/store";
import { TestCase, ProblemType } from "@prisma/client";
import { refetch } from "../ProblemStatements";

interface Problem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  notionDocId: string;
}

export function AddCaseDialog() {
  const { toast } = useToast();
  const [LproblemId, setProblemId] = useRecoilState<string>(problemId);
  const [LargumentNames, setArgumentNames] = useRecoilState<string[]>(argumentNames);
  const [LproblemStatementId, setProblemStatementId] = useRecoilState<string>(problemStatementId);
  const [LmainFuncName, setMainFuncName] = useRecoilState<string>(mainFuncName);
  const LglobalLanguagesSupported = useRecoilValue<CodeLanguage[]>(globalLanguagesSupported);
  const LlanguagesSupported = useRecoilValue<CodeLanguage[]>(languagesSupported);
  const [Lproblem, setProblem] = useRecoilState<Problem>(problem);
  const [inputs, setInputs] = useState<string[]>([""]);
  const [expectedOutput, setExpectedOutput] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const setproblemStatement = useSetRecoilState<ProblemStatement[]>(problemStatementsAtom);
  const setTestCases = useSetRecoilState<TestCase[]>(testCases);

  async function handleCaseAdd() {
    if (inputs.length === LargumentNames.length) {
      if (LproblemStatementId === "") {
        return createFunction();
      }
      try {
        const createdTestCase: TestCase | null = await createTestCase(inputs, expectedOutput, LproblemStatementId);
        const newPs: ProblemStatement[] = await refetch();
        createdTestCase ? setTestCases((prev: TestCase[]) => [...prev, createdTestCase]) : null;
        setproblemStatement(newPs);
        setIsDialogOpen(false);
        setInputs([""]);
        setExpectedOutput("");
      } catch (e) {
        console.log(e);
      }
    } else {
      toast({
        title: "Invalid input arguments",
        description: "Arguments and inputs size cannot be different",
        variant: "destructive",
      });
    }
  }

  const createFunction = async () => {
    const newProblem: Problem | null = await createProblem({
      title: Lproblem.title,
      description: Lproblem.description,
      type: "Code",
      notionDocId: Lproblem.notionDocId,
    });
    if (newProblem) {
      setProblemId(newProblem.id);
      setProblem(newProblem);
    } else {
      toast({ title: "Something went wrong!", description: "Cannot create Problem" });
      return;
    }
    const newPS: ProblemStatement | null = await createProblemStatement({
      problemStatement: {
        argumentNames: LargumentNames,
        mainFuncName: LmainFuncName,
        problemId: newProblem.id,
      },
      languages: LglobalLanguagesSupported.filter((lang) => LlanguagesSupported.map(({ id }) => id).includes(lang.id)),
      testCases: [],
    });
    if (newPS) {
      const newTestCase: TestCase | null = await createTestCase(inputs, expectedOutput, newPS.id);
      if (newTestCase) {
        setTestCases((prev: TestCase[]) => [...prev, newTestCase]);
        setProblemStatementId(newPS.id);
        setArgumentNames(newPS.argumentNames);
        setMainFuncName(newPS.mainFuncName);
        setProblemId(newPS.problemId);
        setIsDialogOpen(false);
      }
    }
    return newPS;
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Add Test Case</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>Add Test</DialogTitle>
          <DialogDescription>This will create a new test object in the database.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <span>
            <b>Arguments: </b>
            {LargumentNames.join("|")}
          </span>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="input" className="text-right">
              Input
            </Label>
            <Input
              id="input"
              value={inputs.join("|")}
              onChange={(e) => setInputs(e.target.value.split("|"))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expectedOutput" className="text-right">
              ExpectedOuput
            </Label>
            <Input
              id="expectedOutput"
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="problemId" className="text-right">
              Problem Id
            </Label>
            <Input id="problemId" value={LproblemId} className="col-span-3" disabled />
          </div>
        </div>
        <DialogDescription>NOTE: Inputs / Arguments are seperated using pipe("|")</DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
          <Button type="submit" onClick={() => handleCaseAdd()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
