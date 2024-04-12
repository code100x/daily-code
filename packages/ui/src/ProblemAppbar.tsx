import { useRouter } from "next/navigation";
import {
  activeSubmissionIdState,
  activeTabState,
  codeRunLoadingState,
  codeSubmitLoadingState,
  codeValueState,
  fetchSubmissionsLoadingState,
  testCasesState,
  testRunResultsState,
  testSubmitResultState,
} from "@repo/store";
import { Button } from "./shad/ui/button";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";

const FUNC_NAME = "twoSum";

const getInputString = (args: string[]) => {
  return `\n
console.log(${FUNC_NAME}(${args.join(",")}))
`;
};

export const ProblemAppbar = () => {
  const router = useRouter();
  const codeValue = useRecoilValue(codeValueState);
  const [codeRunLoading, setCodeRunLoading] = useRecoilState(codeRunLoadingState);
  const [codeSubmitLoading, setCodeSubmitLoading] = useRecoilState(codeSubmitLoadingState);
  const testCases = useRecoilValue(testCasesState);
  const setTestRunResults = useSetRecoilState(testRunResultsState);
  const setTestSubmitResult = useSetRecoilState(testSubmitResultState);
  const setActiveTab = useSetRecoilState(activeTabState);

  const setActiveSubmissionId = useSetRecoilState(activeSubmissionIdState);
  const setFetchSubmissionsLoading = useSetRecoilState(fetchSubmissionsLoadingState);

  const handleCodeRun = async () => {
    setCodeRunLoading(true);
    setTestRunResults([]);
    const API_URL = `http://localhost:2358/submissions/batch`;
    const submissions = testCases.map((testCase) => {
      return {
        source_code: codeValue + getInputString(testCase.input),
        language_id: 63,
        expected_output: testCase.output,
      };
    });
    console.log("sub", submissions);
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
      const subRes = await fetch(`http://localhost:2358/submissions/batch?tokens=${tokenString}`);

      const subData = await subRes.json();
      setTestRunResults(subData.submissions);
      setCodeRunLoading(false);
    }, 3000);
  };
  const handleCodeSubmit = async () => {
    try {
      setCodeSubmitLoading(true);
      setTestSubmitResult(null);
      const API_URL = `/api/code/submission`;

      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          problemStatementId: "1",
          sourceCode: btoa(codeValue),
          languageId: 63,
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
  };

  return (
    <div className="mr-4 w-40">
      {codeSubmitLoading ? (
        <Button
          variant={"secondary"}
          size={"sm"}
          className="text-green-500"
          disabled={codeRunLoading || codeSubmitLoading}
          onClick={handleCodeSubmit}
        >
          Submit Code
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
