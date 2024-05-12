import { Label, Input } from "@repo/ui/shad/ui";
import { useRecoilState, useSetRecoilState } from "recoil";
import { problemStatementsAtom, testCases } from "@repo/store";
import { Trash2Icon } from "lucide-react";
import { deleteTestCase } from "web/components/utils";
import { refetch } from "../ProblemStatements";
import { TestCase, ProblemStatement } from "@prisma/client";

export default function TestCasesList() {
  const [LtestCases, setTestCases] = useRecoilState<TestCase[]>(testCases);
  const setproblemStatements = useSetRecoilState<ProblemStatement[]>(problemStatementsAtom);

  function updateInputsInTestCase(id: string, value: string[]) {
    setTestCases((prev) => {
      return prev.map((prev) => {
        if (prev.id === id) {
          return { ...prev, inputs: value };
        } else {
          return prev;
        }
      });
    });
  }

  function updateExpectedOutputInTestCase(id: string, value: string) {
    setTestCases((prev) => {
      return prev.map((prev) => {
        if (prev.id == id) {
          return { ...prev, expectedOutput: value };
        } else {
          return prev;
        }
      });
    });
  }

  async function handleDelete(id: string) {
    deleteTestCase(id).then(async (data) => {
      const newPs = await refetch();
      setproblemStatements(newPs);
    });
  }

  return (
    <div className="grid grid-cols-2 place-content-center">
      <Label>Inputs</Label>
      <Label>Expected Outputs</Label>
      {LtestCases.map((testCase) => {
        return (
          <div className="col-span-2 flex align-middle justify-evenly" key={testCase.id}>
            <Input
              key={"input"}
              value={testCase.inputs.join("|")}
              onChange={(e) => updateInputsInTestCase(testCase.id, e.target.value.split("|"))}
            />
            <Input
              key={"expectedOutput"}
              value={testCase.expectedOutput}
              onChange={(e) => updateExpectedOutputInTestCase(testCase.id, e.target.value)}
            />
            <span className="cursor-pointer p-1">
              <Trash2Icon onClick={() => handleDelete(testCase.id)} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
