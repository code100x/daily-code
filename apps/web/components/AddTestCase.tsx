"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Button,
  Label,
} from "@repo/ui/shad/ui";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { adminTestCasesState } from "@repo/store";

const AddTestCase = ({ argNames, disabled }: { argNames: string[]; disabled: boolean }) => {
  const [expectedOutput, setExpectedOutput] = useState("");
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const setAdminTestCases = useSetRecoilState(adminTestCasesState);

  const handleInputValuesChange = (event: React.ChangeEvent<HTMLInputElement>, argName: string) => {
    const { value } = event.target;
    setInputValues((prev) => {
      // Remove the key from inputValues if the value is empty
      if (value.trim() === "") {
        const { [argName]: removedKey, ...rest } = prev;
        return rest;
      }
      return { ...prev, [argName]: value };
    });
  };

  const handleCreateTestCase = async () => {
    const inputs = argNames.map((argName) => inputValues[argName] || "");
    setAdminTestCases((prev) => [...prev, { inputs, expectedOutput }]);
    setOpen(false);
    setInputValues({});
    setExpectedOutput("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        <Button variant="outline">Add Test Case</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Test Case</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-lg">Input:</span>
            <div className="flex flex-col gap-4">
              {argNames.map((argName) => (
                <div key={argName} className="flex flex-col gap-2">
                  <Label htmlFor={argName}>{argName}</Label>
                  <Input
                    id={argName}
                    type="text"
                    className="col-span-3"
                    placeholder={argName}
                    onChange={(event) => handleInputValuesChange(event, argName)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-lg">Expected Output</span>
            <Input
              className="col-span-3"
              type="text"
              id="expectedOutput"
              placeholder="[0, 1]"
              value={expectedOutput}
              onChange={(event) => {
                setExpectedOutput(event.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!expectedOutput || !(Object.values(inputValues).length === argNames.length)}
            onClick={handleCreateTestCase}
          >
            Save Test Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTestCase;
