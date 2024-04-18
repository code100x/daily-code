import {
  argumentNames,
  globalLanguagesSupported,
  languagesSupported,
  mainFuncName,
  problemId,
  problemStatementId,
  problemStatementsAtom,
} from "@repo/store";
import { Button } from "../../../shad/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../shad/ui/dailog";
import { Label } from "../../../shad/ui/label";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Textarea } from "../../../shad/ui/textarea";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ProblemStatement, CodeLanguage, TestCase } from "prisma/prisma-client";
import { createProblemStatement, createTestCase } from "web/components/utils";
import { refetch } from "../ProblemStatements";
import { useToast } from "../../../shad/ui/use-toast";

export default function JsonImportButton() {
  const LproblemStatementId: string = useRecoilValue(problemStatementId);
  const LargumentNames: string[] = useRecoilValue(argumentNames);
  const LmainFuncName: string = useRecoilValue(mainFuncName);
  const LproblemId: string = useRecoilValue(problemId);
  const LlanguagesSupported: CodeLanguage[] = useRecoilValue(languagesSupported);
  const setProblemStatementId: Dispatch<SetStateAction<string>> = useSetRecoilState(problemStatementId);
  const setProblemStatement: Dispatch<SetStateAction<ProblemStatement[]>> = useSetRecoilState(problemStatementsAtom);
  const LglobalLanguagesSupported = useRecoilValue(globalLanguagesSupported);
  const sampleInput = ["arg1", "arg2", "arg3", "arg4", "arg5", "arg6", "arg7", "arg8", "arg9", "arg10"];
  const sampleJSON = [
    { input: sampleInput.slice(0, LargumentNames.length), output: "[0,1]" },
    { input: sampleInput.slice(0, LargumentNames.length), output: "[0,1]" },
  ];
  const [inputJSON, setInputJSON] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toast = useToast();
  async function handleCaseAdd(inputs: string[], expectedOutput: string) {
    if (inputs.length === LargumentNames.length) {
      try {
        await createTestCase(LproblemStatementId, inputs, expectedOutput);
      } catch (e) {}
    } else {
      toast.toast({
        title: "Invalid JSON",
        description: "Arguments and inputs size cannot be different and file should be a valid JSON",
        variant: "destructive",
      });
    }
  }
  const importJSON = async () => {
    const promiseArr: Promise<void>[] = [];
    inputJSON.forEach((iJSON: { input: string[]; output: string }) => {
      promiseArr.push(handleCaseAdd(iJSON.input, iJSON.output));
    });
    Promise.all(promiseArr).then((data) => {
      refetch().then((data: ProblemStatement[]) => {
        setProblemStatement(data);
        setIsDialogOpen(false);
      });
    });
  };

  useEffect(() => {
    const createFunction = async () => {
      const newPS: ProblemStatement | null = await createProblemStatement({
        problemStatement: {
          argumentNames: LargumentNames,
          mainFuncName: LmainFuncName,
          problemId: LproblemId,
        },
        languages: LglobalLanguagesSupported.filter((lang: CodeLanguage) => LlanguagesSupported.includes(lang.value)),
        testCases: [],
      });
      if (newPS) {
        setProblemStatementId(newPS.id);
      }
      return newPS;
    };
    createFunction();
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import JSON</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!inputJSON && (
          <DialogHeader>
            <DialogTitle>Sample TestCase.json</DialogTitle>
            <pre>{JSON.stringify(sampleJSON, null, 2)}</pre>
          </DialogHeader>
        )}
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
