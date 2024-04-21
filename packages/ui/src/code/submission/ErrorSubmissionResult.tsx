import { useRecoilValue } from "recoil";
import { activeSubmissionResultSelector } from "@repo/store";
import SubmissionCreatedAt from "./SubmissionCreatedAt";
import { error } from "console";

const ErrorSubmissionResult = () => {
  const submissionDetails = useRecoilValue(activeSubmissionResultSelector);
  const { statusDesc, createdAt, testCasesPassed, problemStatement, lastTestCase, errorMessage } = submissionDetails;

  return (
    <div className="p-4 text-[#CCC]">
      <span className="font-bold text-xl text-red-800">{statusDesc}</span>
      &nbsp; &nbsp;
      <span className="text-sm text-gray-500">
        | &nbsp; &nbsp;
        {testCasesPassed}/{problemStatement.testCases.length} testcases passed
      </span>
      <SubmissionCreatedAt createdAt={createdAt} />
      {errorMessage && (
        <div className="my-8 bg-[#372B2B] rounded-lg w-full p-4 text-[#F8604C] h-[300px] overflow-auto">
          <pre className="text-wrap">{errorMessage}</pre>
        </div>
      )}
      <div className="my-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-gray-300">Last Executed Input</span>
          {lastTestCase.inputs.map((inputParam: any, index: any) => {
            return (
              <div className="flex flex-col gap-1 bg-gray-600  px-3 py-2 rounded-lg" key={index}>
                <span className="text-gray-300 text-xs">{problemStatement.argumentNames[index]} = </span>
                <span className="text-sm font-medium">{inputParam}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ErrorSubmissionResult;
