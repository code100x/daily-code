import { Dispatch, SetStateAction, useState } from "react";
import { Button, DialogClose } from "../../..";
import { createProblemStatement, updateProblemStatement } from "web/components/utils";
import {
  argumentNames,
  globalLanguagesSupported,
  languagesSupported,
  mainFuncName,
  problem,
  problemId,
  problemStatementId,
  problemStatementsAtom,
} from "@repo/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { refetch } from "../ProblemStatements";
import { Problem, ProblemStatement, CodeLanguage } from "prisma/prisma-client";

export default function FormFooter({
  setIsDialogOpen,
  isNew,
}: {
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  isNew: boolean;
}) {
  const LargumentNames: string[] = useRecoilValue(argumentNames);
  const Lproblem: Problem = useRecoilValue(problem);
  const LmainFuncName: string = useRecoilValue(mainFuncName);
  const LproblemStatementId: string = useRecoilValue(problemStatementId);
  const LproblemId: string = useRecoilValue(problemId);
  const setproblemStatements: Dispatch<SetStateAction<ProblemStatement[]>> = useSetRecoilState(problemStatementsAtom);
  const LglobalLanguagesSupported: CodeLanguage[] = useRecoilValue(globalLanguagesSupported);
  const [isSaving, setIsSaving]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  const LlanguagesSupported: CodeLanguage[] = useRecoilValue(languagesSupported);

  function handleDiscard() {
    setIsDialogOpen(false);
  }

  const handleSave = async () => {
    setIsSaving(true);
    const { id, ...LproblemElse } = Lproblem;
    await updateProblemStatement(LproblemStatementId, {
      argumentNames: LargumentNames,
      mainFuncName: LmainFuncName,
      problem: {
        update: {
          where: { id },
          data: LproblemElse,
        },
      },
      languagesSupported: { set: LglobalLanguagesSupported.filter((lang) => LlanguagesSupported.includes(lang.value)) },
    });
    setIsSaving(false);
    setIsDialogOpen(false);
    const newPs: ProblemStatement[] = await refetch();
    setproblemStatements(newPs);
  };

  const createNewPS = async () => {
    setIsSaving(true);
    await createProblemStatement({
      problemStatement: {
        argumentNames: LargumentNames,
        mainFuncName: LmainFuncName,
        problemId: LproblemId,
      },
      languages: LglobalLanguagesSupported.filter((lang) => LlanguagesSupported.includes(lang.value)),
      testCases: [],
    });
    setIsSaving(false);
    setIsDialogOpen(false);
    const newPs: ProblemStatement[] = await refetch();
    setproblemStatements(newPs);
  };

  return (
    <div className="flex gap-3">
      <DialogClose asChild>
        <Button variant={"outline"} className="" onClick={handleDiscard}>
          Discard
        </Button>
      </DialogClose>
      <Button variant={"outline"} className="" onClick={isNew ? createNewPS : handleSave}>
        {isSaving ? "Saving" : "Save"}
      </Button>
    </div>
  );
}
