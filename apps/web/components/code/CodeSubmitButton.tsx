import {
  activeSubmissionIdState,
  activeTabState,
  codeRunLoadingState,
  codeSubmitLoadingState,
  codeValueState,
  fetchSubmissionsLoadingState,
  languageState,
  testSubmitResultState,
} from "@repo/store";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { Button } from "@repo/ui/shad/ui";
import { CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";

const CodeSubmitButton = ({
  problemStatement: { id, languagesSupported, testCases, mainFuncName },
}: {
  problemStatement: ProblemStatement & {
    languagesSupported: CodeLanguage[];
    testCases: TestCase[];
  };
}) => {
  const codeValue = useRecoilValue(codeValueState);
  const language = useRecoilValue(languageState);
  const codeRunLoading = useRecoilValue(codeRunLoadingState);
  const [codeSubmitLoading, setCodeSubmitLoading] = useRecoilState(codeSubmitLoadingState);

  const setTestSubmitResult = useSetRecoilState(testSubmitResultState);
  const setActiveTab = useSetRecoilState(activeTabState);

  const setActiveSubmissionId = useSetRecoilState(activeSubmissionIdState);
  const setFetchSubmissionsLoading = useSetRecoilState(fetchSubmissionsLoadingState);

  const handleCodeSubmit = async () => {
    const languageId = languagesSupported?.find((l) => l.value === language)?.id;
    if (languageId) {
      try {
        setCodeSubmitLoading(true);
        setTestSubmitResult(null);

        const res = await fetch("/api/code/submission", {
          method: "POST",
          body: JSON.stringify({
            problemStatementId: id,
            sourceCode: btoa(codeValue[language]),
            languageId: languageId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          const data = await res.json();
          setActiveSubmissionId(data.submissionId);
        }
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
    <Button
      variant={"secondary"}
      size={"sm"}
      className="text-green-500"
      disabled={codeRunLoading || codeSubmitLoading}
      onClick={handleCodeSubmit}
    >
      Submit Code
    </Button>
  );
};

export default CodeSubmitButton;
