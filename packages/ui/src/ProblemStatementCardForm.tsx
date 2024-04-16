"use client";
import { useState } from "react";
import { ProblemStatement } from "@prisma/client";
import { CardTitle } from "./shad/ui/card";
import { Button } from "./shad/ui/button";
import { Input } from "./shad/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shad/ui/dropdown-menu";
import { Label } from "@radix-ui/react-label";
import supportedLanguages from "./code/SupportedLanguages";
import MultipleOptionChip from "./MultipleOptionChip";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from "./shad/ui/dailog";
import ProblemEditInput from "./ProblemEditInput";
import TestCasesList from "./TestCasesList";
import { AddCaseDialog } from "./AddCaseDialog";
import { updateProblem, updateProblemStatement, updateTestCase } from "../../../apps/web/components/utils";
export default function ProblemStatementCardForm({ problemStatement }: { problemStatement: ProblemStatement }) {
  const [testCases, setTestCases] = useState(problemStatement.testCases);
  const [problem, setProblem] = useState(problemStatement.problem);
  const [problemId, setProblemId] = useState(problemStatement.problemId);
  const [languagesSupported, setLanguagesSupported] = useState(
    problemStatement.languagesSupported.map((language) => language.value)
  );
  const [mainFuncName, setMainFuncName] = useState(problemStatement.mainFuncName);
  const [argumentNames, setArgumentNames] = useState(problemStatement.argumentNames);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  async function handleSave(id: string) {
    const parsedLanguages = supportedLanguages.filter((lang) => languagesSupported.includes(lang.value));
    const updatedProblemStatement = await updateProblemStatement(id, {
      mainFuncName,
      argumentNames,
    });
    const updatedProblem = await updateProblem(problemId, problem);
    // const updatedTestCases = testCases.map(async (testcase) => {
    //   const res = await updateTestCase(testcase.id, testCases.expectedOuput, problemStatement.id, testCases.inputs);
    //   return res;
    // });
    setIsDialogOpen(false);
  }

  function handleDiscard() {
    setTestCases(problemStatement.testCases);
    setProblem(problemStatement.problem);
    setProblemId(problemStatement.problemId);
    setLanguagesSupported(problemStatement.languagesSupported.map((language) => language.value));
    setMainFuncName(problemStatement.mainFuncName);
    setArgumentNames(problemStatement.argumentNames);
  }

  function updateInputsInTestCase(index, value) {
    setTestCases((prev) => {
      prev[index] = { ...prev, inputs: value };
      return prev;
    });
  }

  function updateExpectedOutputInTestCase(index, value) {
    setTestCases((prev) => {
      prev[index] = { ...prev, expectedOutput: value };
      return prev;
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="w-min-[1290px]">
        <DialogHeader>
          <div className="flex justify-between">
            <CardTitle className="flex gap-2">
              Id:
              <Input value={problemId} onChange={(e) => setProblemId(e.target.value)} />
            </CardTitle>
            <div className="flex gap-3">
              <DialogClose asChild>
                <Button variant={"outline"} className="" onClick={handleDiscard}>
                  Discard
                </Button>
              </DialogClose>
              <Button variant={"outline"} className="" onClick={() => handleSave(problemStatement.id)}>
                Save
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div>
          <Label className="m-1">MainFunction:</Label>
          <Input value={mainFuncName} onChange={(e) => setMainFuncName(e.target.value)} />
        </div>
        <div>
          <Label>
            {languagesSupported.map((lang) => {
              return <MultipleOptionChip value={lang} key={lang} />;
            })}
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full px-3">
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Languages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {supportedLanguages.map((lang) => (
                <DropdownMenuCheckboxItem
                  key={lang.value + "option"}
                  checked={languagesSupported.includes(lang.value)}
                  onCheckedChange={() => {
                    if (languagesSupported.includes(lang.value)) {
                      const newArr = languagesSupported.filter((language) => language !== lang.value);
                      setLanguagesSupported(newArr);
                    } else {
                      setLanguagesSupported((prev) => [...prev, lang.value]);
                    }
                  }}
                >
                  {lang.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Label className="text-xl">Arguments:</Label>
          <Input
            value={argumentNames.join("|")}
            onChange={(e) => {
              setArgumentNames((prev) => e.target.value.split("|"));
            }}
          />
        </div>
        <div>
          <TestCasesList
            testCases={testCases}
            setTestCases={setTestCases}
            updateInputsInTestCase={updateInputsInTestCase}
            updateExpectedOutputInTestCase={updateExpectedOutputInTestCase}
          />
        </div>
        <div>
          <AddCaseDialog argumentNames={argumentNames} problemStatement={problem} />
        </div>
        <div>
          <ProblemEditInput problem={problem} setProblem={setProblem} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
