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
import { Button } from "@repo/ui/shad/ui";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/shad/ui";
import { Label } from "@repo/ui/shad/ui";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { Textarea } from "@repo/ui/shad/ui";
import { useState } from "react";
import { ProblemStatement, CodeLanguage } from "prisma/prisma-client";
import { createProblem, createProblemStatement, createTestCase } from "web/components/utils";
import { refetch } from "../ProblemStatements";
import { useToast } from "@repo/ui/shad/ui";
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
  const sampleInput: string[] = ["arg1", "arg2", "arg3", "arg4", "arg5", "arg6", "arg7", "arg8", "arg9", "arg10"];
  const sampleCSV: string =
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

  const splitCsvString = (inputString: string): string[] => {
    const objects: string[] = [];
    let currentObject: string = "";
    let depth: number = 0;

    for (const char of inputString) {
      if (char === "[" || char === "{") {
        depth++;
      } else if (char === "]" || char === "}") {
        depth--;
      }

      if (char === "," && depth === 0) {
        objects.push(currentObject.trim());
        currentObject = "";
      } else {
        currentObject += char;
      }
    }

    if (currentObject.trim() !== "") {
      objects.push(currentObject.trim());
    }

    return objects;
  };

  const importCSV = async () => {
    const promiseArr: Promise<void>[] = [];
    const inputArr: string[] = inputCSV.split("\n");
    const testCasesFromCSV: Omit<TestCase, "problemStatementId" | "id">[] = [];
    inputArr.forEach((input: string) => {
      const expectedOutput: string | undefined = splitCsvString(input).pop();
      testCasesFromCSV.push({
        inputs: splitCsvString(input).slice(0, LargumentNames.length),
        expectedOutput: expectedOutput ?? "",
      });
    });
    testCasesFromCSV.forEach((testCase) => {
      promiseArr.push(handleCaseAdd(testCase.inputs, testCase.expectedOutput));
    });

    Promise.all(promiseArr).then(() => {
      refetch().then((data: ProblemStatement[]) => {
        setproblemStatements(data);
        setIsDialogOpen(false);
        setInputCSV("");
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
        <DialogHeader>
          <DialogTitle>Sample TestCase.json</DialogTitle>
          {!inputCSV && <pre>Sample: {sampleCSV}</pre>}
        </DialogHeader>
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
              value={inputCSV}
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
