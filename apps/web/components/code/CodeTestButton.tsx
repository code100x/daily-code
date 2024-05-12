import {
  codeRunLoadingState,
  codeSubmitLoadingState,
  codeValueState,
  languageState,
  testRunResultsState,
} from "@repo/store";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { Button } from "@repo/ui/shad/ui";
import { CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";

const getInputString = (args: string[], funcName: string) => {
  return `\n
console.log(${funcName}(${args.join(",")}))
`;
};

const CodeTestButton = ({
  problemStatement: { languagesSupported, testCases, mainFuncName },
}: {
  problemStatement: ProblemStatement & {
    languagesSupported: CodeLanguage[];
    testCases: TestCase[];
  };
}) => {
  const codeValue = useRecoilValue(codeValueState);
  const language = useRecoilValue(languageState);
  const [codeRunLoading, setCodeRunLoading] = useRecoilState(codeRunLoadingState);
  const codeSubmitLoading = useRecoilValue(codeSubmitLoadingState);
  const setTestRunResults = useSetRecoilState(testRunResultsState);

  const handleCodeRun = async () => {
    const languageId = languagesSupported?.find((l) => l.value === language)?.id;
    if (languageId) {
      setCodeRunLoading(true);
      setTestRunResults([]);
      const submissions = testCases.map((testCase) => {
        return {
          source_code: codeValue[language] + getInputString(testCase.inputs, mainFuncName),
          language_id: languageId,
          expected_output: testCase.expectedOutput,
        };
      });
      const res = await fetch("/api/code/test", {
        method: "POST",
        body: JSON.stringify({
          submissions,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        setTestRunResults(data.submissions);
      }
      setCodeRunLoading(false);
    }
  };

  return (
    <Button variant={"secondary"} size={"sm"} onClick={handleCodeRun} disabled={codeRunLoading || codeSubmitLoading}>
      Run Code
    </Button>
  );
};

export default CodeTestButton;
