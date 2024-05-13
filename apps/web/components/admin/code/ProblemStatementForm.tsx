"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import {
  testCases,
  problem,
  problemId,
  languagesSupported,
  mainFuncName,
  argumentNames,
  problemStatementId,
  globalLanguagesSupported,
} from "@repo/store";
import { ProblemStatement } from "@prisma/client";
import { Button, Label, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@repo/ui";
import ProblemEditInput from "./components/ProblemEditInput";
import TestCasesList from "./components/TestCasesList";
import { AddCaseDialog } from "./components/AddCaseDialog";
import FormHeader from "./components/FormHeader";
import LanguageDropDownInput from "./components/LanguageDropDownInput";
import MainFunctionInput from "./components/MainFunctionInput";
import ArgumentNamesInput from "./components/ArgumentNamesInput";
import FormFooter from "./components/FormFooter";
import { getAllLanguagesSupported } from "../../utils";
import { CodeLanguage, TestCase, ProblemType } from "@prisma/client";
import JsonImportButton from "./components/JsonImportButton";
import CsvImportButton from "./components/CsvImportButton";

interface Problem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  notionDocId: string;
}

type LocalPS = ProblemStatement & {
  languagesSupported: CodeLanguage[];
  argumentNames?: string[];
  testCases?: TestCase[];
  problem: Problem;
};

export default function ProblemStatementForm({
  problemStatement,
  isNew,
}: {
  problemStatement: LocalPS;
  isNew: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  const setTestCases: Dispatch<SetStateAction<TestCase[]>> = useSetRecoilState(testCases);
  const [Lproblem, setProblem] = useRecoilState(problem);
  const setProblemId: Dispatch<SetStateAction<string>> = useSetRecoilState(problemId);
  const setLanguagesSupported: Dispatch<SetStateAction<CodeLanguage[]>> = useSetRecoilState(languagesSupported);
  const setMainFuncName: Dispatch<SetStateAction<string>> = useSetRecoilState(mainFuncName);
  const setArgumentNames: Dispatch<SetStateAction<string[]>> = useSetRecoilState(argumentNames);
  const setProblemStatementId: Dispatch<SetStateAction<string>> = useSetRecoilState(problemStatementId);
  const setGlobalLanguagesSupported: Dispatch<SetStateAction<CodeLanguage[]>> =
    useSetRecoilState(globalLanguagesSupported);

  useEffect(() => {
    if (isDialogOpen) {
      problemStatement.testCases ? setTestCases(problemStatement.testCases) : null;
      problemStatement.problem ? setProblem(problemStatement.problem) : null;
      problemStatement.languagesSupported ? setLanguagesSupported(problemStatement.languagesSupported) : null;
      setProblemId(problemStatement.problemId);
      setMainFuncName(problemStatement.mainFuncName);
      setArgumentNames(problemStatement.argumentNames);
      setProblemStatementId(problemStatement.id);
    }
    const getAndSetLang = async () => {
      const languages: CodeLanguage[] = await getAllLanguagesSupported();
      setGlobalLanguagesSupported(languages);
    };
    getAndSetLang();
  }, [problemStatement, isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{isNew ? "Add Problem Statement" : "Edit"}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1290px] w-screen grid grid-cols-2">
        <div className="flex flex-col gap-2">
          {!isNew && (
            <DialogHeader>
              <FormHeader />
            </DialogHeader>
          )}
          <MainFunctionInput />
          <LanguageDropDownInput />
          <ArgumentNamesInput />
          <ProblemEditInput Lproblem={Lproblem} />
          <DialogFooter>
            <FormFooter setIsDialogOpen={setIsDialogOpen} isNew={isNew} />
          </DialogFooter>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Test Cases:</Label>
          <TestCasesList />
          <AddCaseDialog />
          <JsonImportButton />
          <CsvImportButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
