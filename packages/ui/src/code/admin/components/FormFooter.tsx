import { Dispatch, SetStateAction, useState } from "react";
import { Button, DialogClose } from "../../..";
import { createProblemStatement, getAllLanguagesSupported, updateProblemStatement } from "web/components/utils";
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

export default function FormFooter({
  setIsDialogOpen,
  isNew,
}: {
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  isNew: boolean;
}) {
  const LargumentNames = useRecoilValue(argumentNames);
  const Lproblem = useRecoilValue(problem);
  const LmainFuncName = useRecoilValue(mainFuncName);
  const LproblemStatementId = useRecoilValue(problemStatementId);
  const LproblemId = useRecoilValue(problemId);
  const setproblemStatement = useSetRecoilState(problemStatementsAtom);
  const LglobalLanguagesSupported = useRecoilValue(globalLanguagesSupported);
  const [isSaving, setIsSaving] = useState(false);
  const LlanguagesSupported = useRecoilValue(languagesSupported);

  function handleDiscard() {
    setIsDialogOpen(false);
  }

  const handleSave = async () => {
    setIsSaving(true);
    const { id, ...LproblemElse } = Lproblem;
    const problemStatement = await updateProblemStatement(LproblemStatementId, {
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
    const newPs = await refetch();
    setproblemStatement(newPs);
  };

  const createNewPS = async () => {
    setIsSaving(true);
    const problemStatement = await createProblemStatement({
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
    const newPs = await refetch();
    setproblemStatement(newPs);
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
