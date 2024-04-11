import { useRouter } from "next/navigation";
import { codeRunLoadingState, codeValueState, testCasesState, testRunResultsState } from "../../store/src/atoms";
import { Button } from "./shad/ui/button";
import { useRecoilValue, useSetRecoilState } from "recoil";

const FUNC_NAME = "twoSum";

const getInputString = (args: string[]) => {
  return `\n
console.log("Output", ${FUNC_NAME}(${args.join(",")}))
`;
};

export const ProblemAppbar = () => {
  const router = useRouter();
  const codeValue = useRecoilValue(codeValueState);
  const setCodeRunLoading = useSetRecoilState(codeRunLoadingState);
  const testCases = useRecoilValue(testCasesState);
  const setTestRunResults = useSetRecoilState(testRunResultsState);

  function compareStdouts(submissions: any[]) {
    console.log("submissions", submissions);

    let submissionFailed = false;

    const results: any = [];
    let runtime = 0;
    submissions.forEach((submission: any, i) => {
      if (testCases[i]) {
        const stdoutArr = submission.stdout.split("Output");

        const [stdout, output] = stdoutArr;
        console.log("SDAvfswfers", eval(output));
        console.log("SDArs", eval(testCases[i]?.output!));

        const isAccepted = JSON.stringify(eval(output)) === JSON.stringify(eval(testCases[i]?.output!));

        console.log("Zdcsafse", isAccepted);

        runtime += parseFloat(submission.time) * 1000;
        if (!isAccepted) {
          submissionFailed = true;
        }
        results.push({
          stdout,
          output: output.trim(),
          expectedOutput: testCases[i]?.output,
          input: testCases[i].input,
          stderr: submission.stderr,
          token: submission.token,
          isAccepted,
        });
      }
    });

    return {
      runtime,
      submissionFailed,
      results,
    };
  }

  const handleSubmit = async () => {
    setCodeRunLoading(true);
    setTestRunResults(null);
    const API_URL = `http://localhost:2358/submissions/batch`;
    const submissions = testCases.map((testCase) => {
      return {
        source_code: codeValue + getInputString(testCase.input),
        language_id: 63,
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

      const result: any = compareStdouts(subData.submissions);
      setTestRunResults(result);
      setCodeRunLoading(false);
      router.push("/tracks/1/2/3");
    }, 3000);
  };

  return (
    <div className="mt-2 ml-2 mr-2 flex justify-between">
      <div className="flex justify-center content-center flex-1">
        <Button variant={"secondary"} size={"sm"} className="mr-2" onClick={handleSubmit}>
          Run Code
        </Button>
        <Button variant={"secondary"} size={"sm"} className="ml-2 text-green-500">
          Submit Code
        </Button>
      </div>
    </div>
  );
};
