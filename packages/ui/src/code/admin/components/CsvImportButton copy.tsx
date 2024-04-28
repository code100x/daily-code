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
import { Button } from "../../../shad/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../shad/ui/dailog";
import { Label } from "../../../shad/ui/label";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { Textarea } from "../../../shad/ui/textarea";
import { useState } from "react";
import { ProblemStatement, CodeLanguage } from "prisma/prisma-client";
import { createProblem, createProblemStatement, createTestCase } from "web/components/utils";
import { refetch } from "../ProblemStatements";
import { useToast } from "../../../shad/ui/use-toast";
import { TestCase, ProblemType } from "@prisma/client";

interface Problem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  notionDocId: string;
}

export default function CsvImportButton() {
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
  const sampleCSV =
    sampleInput.slice(0, LargumentNames.length).join(",") +
    ",[0,1]" +
    "," +
    sampleInput.slice(0, LargumentNames.length).join(",") +
    ",[0,1]";
  const [inputCSV, setInputCSV] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function handleCaseAdd(inputs: string[], expectedOutput: string) {
    if (inputs.length === LargumentNames.length) {
      try {
        const createdTestCase: TestCase | null = await createTestCase(inputs, expectedOutput, LproblemStatementId);
        createdTestCase ? setTestCases((prev: TestCase[]) => [...prev, createdTestCase]) : null;
      } catch (e) {}
    } else {
      toast({
        title: "Invalid CSV",
        description: "Arguments and inputs size cannot be different and file should be a valid JSON",
        variant: "destructive",
      });
    }
  }

  const importCSV = async () => {
    console.log(inputCSV);
    const promiseArr: Promise<void>[] = [];
    const inputArr = inputCSV.split("\n");
    const testCasesFromCSV: TestCase[] = [];
    inputArr.forEach((input, index) => {
      testCasesFromCSV.push({
        inputs: input.split(",").slice(0, LargumentNames.length),
        expectedOutput: input.split(",")[LargumentNames.length],
      });
    });
    testCasesFromCSV.forEach((testCase) => {
      promiseArr.push(handleCaseAdd(testCase.inputs, testCase.expectedOutput));
    });

    Promise.all(promiseArr).then((data) => {
      refetch().then((data: ProblemStatement[]) => {
        setproblemStatements(data);
        setIsDialogOpen(false);
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
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {inputCSV && (
          <DialogHeader>
            <DialogTitle>Sample TestCase.json</DialogTitle>
            <pre>{sampleCSV}</pre>
          </DialogHeader>
        )}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="json-input" className="text-left">
              CSV
            </Label>
            <Textarea
              id="json-input"
              className="col-span-4"
              onChange={(e) => {
                setInputCSV(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={importCSV}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
