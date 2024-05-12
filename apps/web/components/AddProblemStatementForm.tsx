"use client";
import { useState } from "react";
import { Problem, CodeLanguage } from "@prisma/client";
import { Input, Button, Label, Checkbox, Card, CardContent } from "@repo/ui/shad/ui";
import AddTestCase from "./AddTestCase";
import { useRecoilValue } from "recoil";
import { adminTestCasesState } from "@repo/store";
import { createProblemStatement } from "./utils";

export const AddProblemStatementForm = ({ problem, languages }: { problem: Problem; languages: CodeLanguage[] }) => {
  const adminTestCases = useRecoilValue(adminTestCasesState);
  const [mainFuncName, setMainFuncName] = useState("");
  const [argumentNames, setArgumentNames] = useState("");
  const [supportedLanguages, setSupportedLanguages] = useState<CodeLanguage[]>([]);

  const handleLanguage = (checked: boolean, language: CodeLanguage) => {
    if (checked) {
      setSupportedLanguages((prev) => [...prev, language]);
    } else {
      setSupportedLanguages((prev) => prev.filter((l) => l.id !== language.id));
    }
  };

  const handleAddPS = async () => {
    await createProblemStatement({
      problemStatement: { argumentNames: argumentNames.trim().split(","), mainFuncName, problemId: problem.id },
      languages: supportedLanguages,
      testCases: adminTestCases,
    });
  };
  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">{problem.title}</h1>
        <Button onClick={handleAddPS}>Add Problem Statement</Button>
      </div>
      <div className="my-4 grid grid-cols-2 gap-24">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mainFuncName">Main Function Name</Label>
            <Input
              id="mainFuncName"
              type="text"
              placeholder="twoSum"
              value={mainFuncName}
              onChange={(event) => {
                setMainFuncName(event.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="argumentNames">Param Names (seperated by commas)</Label>
            <Input
              type="text"
              id="argumentNames"
              placeholder="nums, target"
              value={argumentNames}
              onChange={(event) => {
                setArgumentNames(event.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Test Cases</Label>
              <AddTestCase
                disabled={argumentNames.trim().length === 0}
                argNames={argumentNames.split(",").map((a) => a.trim())}
              />
            </div>
            {adminTestCases.length > 0 ? (
              <div className="flex flex-col gap-5 my-4">
                {adminTestCases.map((testCase) => (
                  <Card className="w-full pt-4">
                    <CardContent>
                      <div className="grid grid-cols-2 w-full gap-8">
                        <div className="flex flex-col space-y-2.5">
                          <span>Inputs</span>
                          {argumentNames
                            .trim()
                            .split(",")
                            .map((arg, index) => (
                              <div key={arg}>
                                <span className="text-[#CCC]">{arg}</span>
                                <div className="bg-gray-600 rounded-md py-1 px-2">{testCase.inputs[index]}</div>
                              </div>
                            ))}
                        </div>
                        <div className="flex flex-col space-y-2.5">
                          <span>Expected Output</span>
                          <div className="bg-gray-600 rounded-md py-1 px-2">{testCase.expectedOutput}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <span className="text-[#CCC]">No Test Cases Added</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Label>Supported Languages</Label>
          {languages.map((language) => {
            const { id, label } = language;
            return (
              <div className="flex items-center space-x-2" key={id}>
                <Checkbox
                  id={id.toString()}
                  onCheckedChange={(checked) => handleLanguage(checked as boolean, language)}
                />
                <Label htmlFor={id.toString()} className="font-medium text-base">
                  {label}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
