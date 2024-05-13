"use client";
import { LoaderCircle, SquareCheck, Terminal } from "lucide-react";
import { ProblemStatement, TestCase } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { Input } from "@repo/ui";
import { codeRunLoadingState, testRunResultsState } from "@repo/store";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";

export const RunCodeOutput = ({
  problemStatement: { testCases, argumentNames },
}: {
  problemStatement: ProblemStatement & {
    testCases: TestCase[];
  };
}) => {
  const [activeTab, setActiveTab] = useState("test-case");

  const testRunResults = useRecoilValue(testRunResultsState);
  const codeRunLoading = useRecoilValue(codeRunLoadingState);

  useEffect(() => {
    if (codeRunLoading) {
      if (activeTab === "test-result") {
        setActiveTab("test-case");
      }
      setActiveTab("test-result");
    }
  }, [codeRunLoading]);

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="p-4">
      <TabsList className="">
        <TabsTrigger value="test-case" className="w-full px-4">
          <SquareCheck className="mr-2 text-[#0E902A]" size={16} />
          Test Cases
        </TabsTrigger>
        <TabsTrigger value="test-result" className="w-full px-4">
          {codeRunLoading ? (
            <LoaderCircle className="animate-spin mr-2" size={16} />
          ) : (
            <Terminal className="mr-2 text-[#0E902A]" size={16} />
          )}
          Test Result
        </TabsTrigger>
      </TabsList>
      <TabsContent value="test-case" className="">
        <Tabs defaultValue={testCases[0]?.id.toString()} className="w-full p-4">
          <TabsList className="bg-transparent gap-4 flex-wrap justify-start">
            {testCases.map(({ id }, index) => (
              <TabsTrigger
                value={id.toString()}
                key={id}
                className="bg-transparent text-[#ddd] hover:text-white group-hover:bg-gray-500 data-[state=active]:bg-gray-600 px-5"
              >
                Case {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {testCases.map(({ id, inputs }, index) => (
            <TabsContent value={id.toString()} key={id}>
              <div className="px-2 py-4 flex flex-col gap-6">
                {inputs.map((inputParam, index) => {
                  return (
                    <div className="flex flex-col gap-2" key={index}>
                      <span className="text-gray-400 text-sm">{argumentNames[index]} = </span>
                      <Input className="focus:bg-gray-700 bg-gray-600 text-white" defaultValue={inputParam} />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </TabsContent>
      <TabsContent value="test-result" className="">
        {testRunResults.length > 0 && (
          <div className="p-4">
            <Tabs defaultValue={testRunResults[0].token} className="w-full">
              <TabsList className="bg-transparent gap-4 flex-wrap justify-start">
                {testRunResults.map(({ token, status }, index) => {
                  return (
                    <TabsTrigger
                      value={token}
                      key={token}
                      className="bg-transparent text-[#ddd] hover:text-white group-hover:bg-gray-500 data-[state=active]:bg-gray-600 px-5"
                    >
                      <span
                        className={`mr-2 rounded-full h-2 w-2 ${status.id <= 3 ? "bg-[#0E902A]" : "bg-red-800"}`}
                      ></span>{" "}
                      Case {index + 1}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {testRunResults.map(({ token, stdout }, index) => (
                <TabsContent value={token} key={token}>
                  <div className="px-2 py-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <span className="text-gray-300">Input</span>
                      {testCases[index]?.inputs.map((inputParam: any, index: any) => {
                        return (
                          <div className="flex flex-col gap-1 bg-gray-600 text-white px-3 py-2 rounded-lg" key={index}>
                            <span className="text-gray-300 text-xs">{argumentNames[index]} = </span>
                            <span className="text-sm font-medium">{inputParam}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="text-gray-300">Output</span>
                      <div className="flex flex-col gap-1 bg-gray-600 text-white px-3 py-2 rounded-lg">
                        <span className="text-sm font-medium">{stdout}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="text-gray-300">Expected</span>
                      <div className="flex flex-col gap-1 bg-gray-600 text-white px-3 py-2 rounded-lg">
                        <span className="text-sm font-medium">{testCases[index]?.expectedOutput}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
