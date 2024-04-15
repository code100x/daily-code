import { useRecoilValue } from "recoil";
import { activeSubmissionResultSelector } from "@repo/store";
import SubmissionCreatedAt from "./SubmissionCreatedAt";
import { Submission, ProblemStatement, TestCase } from "@prisma/client";

const WrongSubmissionResult = ({}: {}) => {
  const submissionDetails = useRecoilValue(activeSubmissionResultSelector);
  const { statusDesc, createdAt, testCasesPassed, problemStatement, lastTestCase, stdout } = submissionDetails;
  return (
    <div className="p-4 text-[#CCC]">
      <span className="font-bold text-xl text-red-800">{statusDesc}</span>
      &nbsp; &nbsp;
      <span className="text-sm text-gray-500">
        | &nbsp; &nbsp;
        {testCasesPassed}/{problemStatement.testCases.length} testcases passed
      </span>
      <SubmissionCreatedAt createdAt={createdAt} />
      <div className="my-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-gray-300">Input</span>
          {lastTestCase.inputs.map((inputParam: string, index: any) => {
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
          <div className="flex flex-col gap-1 border bg-gray-600  px-3 py-2 rounded-lg">
            <span className="text-sm font-medium">{lastTestCase.expectedOutput}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrongSubmissionResult;
