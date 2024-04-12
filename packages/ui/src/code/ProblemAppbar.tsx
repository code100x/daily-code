import {
  activeSubmissionIdState,
  activeTabState,
  codeRunLoadingState,
  codeSubmitLoadingState,
  codeValueState,
  fetchSubmissionsLoadingState,
  languageState,
  testRunResultsState,
  testSubmitResultState,
} from "@repo/store";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { Button } from "../shad/ui/button";
import { CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";
import { LoaderCircle } from "lucide-react";

const getInputString = (args: string[], funcName: string) => {
  return `\n
console.log(${funcName}(${args.join(",")}))
`;
};

export const ProblemAppbar = ({
  problemStatement: { languagesSupported, testCases, mainFuncName },
}: {
  problemStatement: ProblemStatement & {
    languagesSupported: CodeLanguage[];
    testCases: TestCase[];
  };
}) => {
  console.log("SFCasf", process.env);

  const codeValue = useRecoilValue(codeValueState);
  const language = useRecoilValue(languageState);
  const [codeRunLoading, setCodeRunLoading] = useRecoilState(codeRunLoadingState);
  const [codeSubmitLoading, setCodeSubmitLoading] = useRecoilState(codeSubmitLoadingState);
  const setTestRunResults = useSetRecoilState(testRunResultsState);
  const setTestSubmitResult = useSetRecoilState(testSubmitResultState);
  const setActiveTab = useSetRecoilState(activeTabState);

  const setActiveSubmissionId = useSetRecoilState(activeSubmissionIdState);
  const setFetchSubmissionsLoading = useSetRecoilState(fetchSubmissionsLoadingState);

  const handleCodeRun = async () => {
    const languageId = languagesSupported?.find((l) => l.value === language)?.id;
    if (languageId) {
      setCodeRunLoading(true);
      setTestRunResults([]);
      const API_URL = `${process.env.NEXT_PUBLIC_JUDGE0_API_URL}/submissions/batch`;
      const submissions = testCases.map((testCase) => {
        return {
          source_code: codeValue[language] + getInputString(testCase.inputs, mainFuncName),
          language_id: languageId,
          expected_output: testCase.expectedOutput,
        };
      });
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          submissions,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      const tokenString = data.map((props: any) => props.token).join(",");

      setTimeout(async () => {
        const subRes = await fetch(`${process.env.NEXT_PUBLIC_JUDGE0_API_URL}/submissions/batch?tokens=${tokenString}`);
        const subData = await subRes.json();
        setTestRunResults(subData.submissions);
        setCodeRunLoading(false);
      }, 1000);
    }
  };

  const handleCodeSubmit = async () => {
    const languageId = languagesSupported?.find((l) => l.value === language)?.id;
    if (languageId) {
      try {
        setCodeSubmitLoading(true);
        setTestSubmitResult(null);
        const API_URL = `/api/code/submission`;

        const res = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify({
            problemStatementId: "1",
            sourceCode: btoa(codeValue[language]),
            languageId: languageId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("data, data", data);
        setActiveSubmissionId(data.submissionId);
      } catch (err: any) {
        alert("Error " + err.message);
      } finally {
        setCodeSubmitLoading(false);
        setActiveTab("submissions");
        setFetchSubmissionsLoading(true);
      }
    }
  };

  return (
    <div className="mr-4 w-40">
      {codeSubmitLoading ? (
        <Button variant={"secondary"} size={"sm"} className="text-green-500 px-10 animate-pulse">
          <LoaderCircle className="animate-spin mr-3 text-[#CCC]" size={16} />
          Pending
        </Button>
      ) : (
        <div className="flex justify-center content-center flex-1 gap-2 mr-4">
          <Button
            variant={"secondary"}
            size={"sm"}
            onClick={handleCodeRun}
            disabled={codeRunLoading || codeSubmitLoading}
          >
            Run Code
          </Button>
          <Button
            variant={"secondary"}
            size={"sm"}
            className="text-green-500"
            disabled={codeRunLoading || codeSubmitLoading}
            onClick={handleCodeSubmit}
          >
            Submit Code
          </Button>
        </div>
      )}
    </div>
  );
};
