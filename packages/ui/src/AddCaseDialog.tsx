import { Button } from "./shad/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./shad/ui/dailog";
import { Input } from "./shad/ui/input";
import { Label } from "./shad/ui/label";
import { useState } from "react";
import { ProblemStatement } from "@prisma/client";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { createTestCase } from "../../../apps/web/components/utils";
import { useToast } from "./shad/ui/use-toast";
export function AddCaseDialog({
  problemStatement,
  argumentNames,
}: {
  problemStatement: ProblemStatement;
  argumentNames: string[];
}) {
  const [inputs, setInputs] = useState([""]);
  const [expectedOutput, setExpectedOutput] = useState("");
  const toast = useToast();

  async function handleCaseAdd() {
    if (inputs.length === argumentNames.length) {
      console.log(problemStatement.id, inputs, expectedOutput);
      try {
        const testcase = await createTestCase(problemStatement.id, inputs, expectedOutput);
        console.log(testcase);
      } catch (e) {
        console.log(e);
      }
    } else {
      toast.toast({
        title: "Invalid input arguments",
        description: "Arguments and inputs size cannot be different",
        variant: "destructive",
      });
    }
  }
  return (
    <Dialog>
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
            {argumentNames.join("|")}
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
            <Input id="problemId" value={problemStatement.id} className="col-span-3" disabled />
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
