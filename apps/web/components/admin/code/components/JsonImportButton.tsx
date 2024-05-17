import {
  argumentNames,
  globalLanguagesSupported,
  languagesSupported,
  mainFuncName,
  problem,
  problemId,
  problemStatementId,
  problemStatementsAtom,
  testCases,
} from "@repo/store";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Textarea,
  useToast,
} from "@repo/ui";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { useState } from "react";
import { ProblemStatement, CodeLanguage } from "prisma/prisma-client";
import { refetch } from "../ProblemStatements";
import { TestCase, ProblemType } from "@prisma/client";
import { createProblem, createProblemStatement, createTestCase } from "../../../utils";

interface Problem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  notionDocId: string;
}

export default function JsonImportButton() {
  const { toast } = useToast();
  const [LtestCases, setTestCases] = useRecoilState<TestCase[]>(testCases);
  const LargumentNames = useRecoilValue<string[]>(argumentNames);
  const LmainFuncName = useRecoilValue<string>(mainFuncName);
  const setProblemId = useSetRecoilState<string>(problemId);
  const Lproblem = useRecoilValue<Problem>(problem);
  const LlanguagesSupported = useRecoilValue<CodeLanguage[]>(languagesSupported);
  const [LproblemStatementId, setProblemStatementId] = useRecoilState<string>(problemStatementId);
  const LglobalLanguagesSupported = useRecoilValue<CodeLanguage[]>(globalLanguagesSupported);
  const setproblemStatements = useSetRecoilState<ProblemStatement[]>(problemStatementsAtom);
  const sampleInput = ["arg1", "arg2", "arg3", "arg4", "arg5", "arg6", "arg7", "arg8", "arg9", "arg10"];
  const sampleJSON = [
    { input: sampleInput.slice(0, LargumentNames.length), output: "[0,1]" },
    { input: sampleInput.slice(0, LargumentNames.length), output: "[0,1]" },
  ];
  const [inputJSON, setInputJSON] = useState<{ input: string[]; output: string }[]>([{ input: [""], output: "" }]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function handleCaseAdd(inputs: string[], expectedOutput: string) {
    if (inputs.length === LargumentNames.length) {
      try {
        const createdTestCase: TestCase | null = await createTestCase(inputs, expectedOutput, LproblemStatementId);
        createdTestCase ? setTestCases((prev: TestCase[]) => [...prev, createdTestCase]) : null;
      } catch (e) {}
    } else {
      toast({
        title: "Invalid JSON",
        description: "Arguments and inputs size cannot be different and file should be a valid JSON",
        variant: "destructive",
      });
    }
  }

  const importJSON = async () => {
    const promiseArr: Promise<void>[] = [];
    inputJSON
      ? inputJSON.forEach((iJSON: { input: string[]; output: string }) => {
          if (iJSON.input[0] === "" && iJSON.input.length === 1 && iJSON.output === "") {
          } else {
            promiseArr.push(handleCaseAdd(iJSON.input, iJSON.output));
          }
        })
      : null;
    Promise.all(promiseArr).then((data) => {
      refetch().then((data: ProblemStatement[]) => {
        setproblemStatements(data);
        setIsDialogOpen(false);
        setInputJSON([{ input: [""], output: "" }]);
      });
    });
  };

  const handleCreateProblem = async () => {
    const createdProblem: Problem | null = await createProblem({
      title: Lproblem.title,
      description: Lproblem.description,
      type: "Code",
      notionDocId: Lproblem.notionDocId,
    });
    !createdProblem ? toast({ title: "Oops! Cannot create problem", description: "Unexpected error occured" }) : null;
    if (createdProblem?.type === "Code") {
      handleCreatePsStatement(createdProblem.id);
    }
    if (createdProblem) {
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

  const handleCreatePsStatement = async (id: string) => {
    const newPS: ProblemStatement | null = await createProblemStatement({
      problemStatement: {
        argumentNames: LargumentNames,
        mainFuncName: LmainFuncName,
        problemId: id,
      },
      languages: LglobalLanguagesSupported.filter((lang) => LlanguagesSupported.map(({ id }) => id).includes(lang.id)),
      testCases: LtestCases,
    });
    if (newPS !== null && newPS !== undefined) {
      setProblemStatementId(newPS.id);
      setProblemId(newPS.problemId);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            if (!LproblemStatementId) {
              handleCreateProblem();
            }
          }}
        >
          Import JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sample TestCase.json</DialogTitle>
          {inputJSON.length === 1 && <pre>Sample: {JSON.stringify(sampleJSON, null, 2)}</pre>}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="json-input" className="text-left">
              JSON
            </Label>
            <Textarea
              id="json-input"
              className="col-span-4"
              onChange={(e) => {
                setInputJSON(JSON.parse(e.target.value));
              }}
              value={JSON.stringify(inputJSON)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={importJSON}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
