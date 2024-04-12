import { Editor } from "@monaco-editor/react";
import { Clock4, Cpu } from "lucide-react";

const WrongSubmissionResult = ({ submissionResult }: { submissionResult: any }) => {
  const {
    statusDesc,
    createdAt,
    runtime,
    memoryUsage,
    language,
    code,
    testCasesPassed,
    problemStatement,
    stdout,
    lastTestCase,
  } = submissionResult;
  console.log("SAfcasef", submissionResult);

  return (
    <div className="p-4 text-[#CCC]">
      <span className="font-bold text-xl text-red-800">{statusDesc}</span>
      &nbsp; &nbsp;
      <span className="text-sm text-gray-500">
        | &nbsp; &nbsp;
        {testCasesPassed}/{problemStatement.testCases.length} testcases passed
      </span>
      <div className="text-xs mt-2">
        submitted at{" "}
        {new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(createdAt))}
      </div>
      <div className="my-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-gray-300">Input</span>
          {lastTestCase.inputs.map((inputParam: any, index: any) => {
            return (
              <div className="flex flex-col gap-1 bg-gray-600  px-3 py-2 rounded-lg" key={index}>
                <span className="text-gray-300 text-xs">{problemStatement.argumentNames[index]} = </span>
                <span className="text-sm font-medium">{inputParam}</span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-gray-300">Output</span>
          <div className="flex flex-col gap-1 bg-gray-600  px-3 py-2 rounded-lg">
            <span className="text-sm font-medium">{stdout}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-gray-300">Expected</span>
          <div className="flex flex-col gap-1 border  px-3 py-2 rounded-lg">
            <span className="text-sm font-medium">{lastTestCase.expectedOutput}</span>
          </div>
        </div>
      </div>
      <div className="my-8">
        <h3>Code | {language.label}</h3>
        <div className="rounded-md overflow-hidden bg-[#1E1E1E] py-4 my-4 h-[300px]">
          <Editor
            height={"100%"}
            value={atob(code)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              lineNumbers: "off",
              readOnly: true,
              scrollBeyondLastLine: false,
            }}
            language={language.value}
          />
        </div>
      </div>
    </div>
  );
};

export default WrongSubmissionResult;
