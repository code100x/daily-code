import { TestCase } from "@prisma/client";
import { Label } from "./shad/ui/label";
import { Input } from "./shad/ui/input";
import { Dispatch, SetStateAction, VoidFunctionComponent } from "react";
export default function TestCasesList({
  testCases,
  updateInputsInTestCase,
  updateExpectedOutputInTestCase,
}: {
  testCases: TestCase[];
  setTestCases: Dispatch<SetStateAction<TestCase[]>>;
  updateInputsInTestCase: any;
  updateExpectedOutputInTestCase: any;
}) {
  return (
    <div className="grid grid-cols-2 place-content-center">
      <Label>Inputs</Label>
      <Label>Expected Outputs</Label>
      {testCases.map((testCase, index) => {
        return (
          <div className="col-span-2 grid grid-cols-2" key={"testcase"}>
            <Input
              key={"input"}
              className="col-span-1"
              value={testCase.inputs.join("|")}
              onChange={(e) => updateInputsInTestCase(index, e.target.value.split("|"))}
            />
            <Input
              key={"expectedOutput"}
              className="col-span-1"
              value={testCase.expectedOutput}
              onChange={(e) => updateExpectedOutputInTestCase(e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
