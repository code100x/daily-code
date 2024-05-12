import { Dispatch, SetStateAction, useState } from "react";
import { updateProblemStatement } from "../../../utils";
import { Button, DialogClose } from "@repo/ui/shad/ui";
import {
  problem,
  argumentNames,
  globalLanguagesSupported,
  languagesSupported,
  mainFuncName,
  problemId,
  problemStatementId,
  problemStatementsAtom,
  testCases,
} from "@repo/store";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { refetch } from "../ProblemStatements";
import { ProblemStatement, CodeLanguage, TestCase } from "@prisma/client";
import { createProblem, createProblemStatement } from "web/components/utils";
import { useToast } from "@repo/ui/shad/ui";
import { ProblemType } from "@prisma/client";

interface Problem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  notionDocId: string;
}

export default function FormFooter({
  setIsDialogOpen,
  isNew,
}: {
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  isNew: boolean;
}) {
  const { toast } = useToast();
  const LargumentNames = useRecoilValue<string[]>(argumentNames);
  const Lproblem = useRecoilValue<Problem>(problem);
  const LmainFuncName = useRecoilValue<string>(mainFuncName);
  const [LproblemStatementId, setProblemStatementId] = useRecoilState<string>(problemStatementId);
  const setproblemStatements = useSetRecoilState<ProblemStatement[]>(problemStatementsAtom);
  const LglobalLanguagesSupported = useRecoilValue<CodeLanguage[]>(globalLanguagesSupported);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const LlanguagesSupported = useRecoilValue<CodeLanguage[]>(languagesSupported);
  const setProblemId = useSetRecoilState<string>(problemId);
  const LtestCases = useRecoilValue<TestCase[]>(testCases);
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
      languagesSupported: {
        set: LglobalLanguagesSupported.filter((lang) => LlanguagesSupported.map(({ id }) => id).includes(lang.id)),
      },
    });
    setIsSaving(false);
    setIsDialogOpen(false);
    const newPs: ProblemStatement[] = await refetch();
    setproblemStatements(newPs);
  };
  const handleCreateProblem = async () => {
    setIsSaving(true);
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
    const NewPSList = await refetch();
    setproblemStatements(NewPSList);
    setIsDialogOpen(false);
    setIsSaving(false);
    if (newPS !== null && newPS !== undefined) {
      setProblemStatementId(newPS.id);
      setProblemId(newPS.problemId);
    }
  };

  return (
    <div className="flex gap-3">
      <DialogClose asChild>
        <Button variant={"outline"} className="" onClick={handleDiscard}>
          Discard
        </Button>
      </DialogClose>
      <Button variant={"outline"} className="" onClick={isNew ? handleCreateProblem : handleSave}>
        {isNew ? (isSaving ? "Creating" : "Create") : isSaving ? "Saving" : "Save"}
      </Button>
    </div>
  );
}
