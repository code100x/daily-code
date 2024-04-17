"use client";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
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
import { Button } from "../../shad/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../shad/ui/dailog";
import ProblemEditInput from "./components/ProblemEditInput";
import TestCasesList from "./components/TestCasesList";
import { AddCaseDialog } from "./components/AddCaseDialog";
import FormHeader from "./components/FormHeader";
import LanguageDropDownInput from "./components/LanguageDropDownInput";
import MainFunctionInput from "./components/MainFunctionInput";
import ArgumentNamesInput from "./components/ArgumentNamesInput";
import FormFooter from "./components/FormFooter";
import { Label } from "../../shad/ui/label";
import { getAllLanguagesSupported } from "web/components/utils";

export default function ProblemStatementForm({
  problemStatement,
  isNew,
}: {
  problemStatement: ProblemStatement;
  isNew: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const setTestCases = useSetRecoilState(testCases);
  const setProblem = useSetRecoilState(problem);
  const setProblemId = useSetRecoilState(problemId);
  const setLanguagesSupported = useSetRecoilState(languagesSupported);
  const setMainFuncName = useSetRecoilState(mainFuncName);
  const setArgumentNames = useSetRecoilState(argumentNames);
  const setProblemStatementId = useSetRecoilState(problemStatementId);
  const setGlobalLanguagesSupported = useSetRecoilState(globalLanguagesSupported);

  useEffect(() => {
    if (isDialogOpen) {
      setTestCases(problemStatement.testCases);
      setProblem(problemStatement.problem);
      setProblemId(problemStatement.problemId);
      setLanguagesSupported(problemStatement.languagesSupported.map((language) => language.value));
      setMainFuncName(problemStatement.mainFuncName);
      setArgumentNames(problemStatement.argumentNames);
      setProblemStatementId(problemStatement.id);
    }
    const getAndSetLang = async () => {
      const languages = await getAllLanguagesSupported();
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
          <ProblemEditInput />
          <DialogFooter>
            <FormFooter setIsDialogOpen={setIsDialogOpen} isNew={isNew} />
          </DialogFooter>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Test Cases:</Label>
          <TestCasesList />
          <AddCaseDialog />
        </div>
      </DialogContent>
    </Dialog>
  );
}
