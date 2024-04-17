import { Button } from "../../../shad/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shad/ui/dailog";
import { Input } from "../../../shad/ui/input";
import { Label } from "../../../shad/ui/label";
import { useEffect, useState } from "react";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { createProblemStatement, createTestCase } from "web/components/utils";
import { useToast } from "../../../shad/ui/use-toast";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {
  problemId,
  argumentNames,
  problemStatementId,
  problemStatementsAtom,
  mainFuncName,
  globalLanguagesSupported,
  languagesSupported,
} from "@repo/store";
import { refetch } from "../ProblemStatements";
export function AddCaseDialog() {
  const LproblemId = useRecoilValue(problemId);
  const LargumentNames = useRecoilValue(argumentNames);
  const [LproblemStatementId, setProblemStatementId] = useRecoilState(problemStatementId);
  const LmainFuncName = useRecoilValue(mainFuncName);
  const LglobalLanguagesSupported = useRecoilValue(globalLanguagesSupported);
  const LlanguagesSupported = useRecoilValue(languagesSupported);
  const [inputs, setInputs] = useState([""]);
  const [expectedOutput, setExpectedOutput] = useState("");
  const toast = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const setproblemStatement = useSetRecoilState(problemStatementsAtom);

  async function handleCaseAdd() {
    if (inputs.length === LargumentNames.length) {
      try {
        const testcase = await createTestCase(LproblemStatementId, inputs, expectedOutput);
        setIsDialogOpen(false);
        setInputs([""]);
        setExpectedOutput("");
        const newPs = await refetch();
        setproblemStatement(newPs);
      } catch (e) {}
    } else {
      toast.toast({
        title: "Invalid input arguments",
        description: "Arguments and inputs size cannot be different",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    const createFunction = async () => {
      const newPS = await createProblemStatement({
        problemStatement: {
          argumentNames: LargumentNames,
          mainFuncName: LmainFuncName,
          problemId: LproblemId,
        },
        languages: LglobalLanguagesSupported.filter((lang) => LlanguagesSupported.includes(lang.value)),
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
        <Button variant={"outline"}>Add Test Case</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>Add Test</DialogTitle>
          <DialogDescription>This will create a new test object in the database.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <span>
            <b>Arguments: </b>
            {LargumentNames.join("|")}
          </span>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="input" className="text-right">
              Input
            </Label>
            <Input
              id="input"
              value={inputs.join("|")}
              onChange={(e) => setInputs(e.target.value.split("|"))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expectedOutput" className="text-right">
              ExpectedOuput
            </Label>
            <Input
              id="expectedOutput"
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="problemId" className="text-right">
              Problem Id
            </Label>
            <Input id="problemId" value={LproblemId} className="col-span-3" disabled />
          </div>
        </div>
        <DialogDescription>NOTE: Inputs / Arguments are seperated using pipe("|")</DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
          <Button type="submit" onClick={() => handleCaseAdd()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
