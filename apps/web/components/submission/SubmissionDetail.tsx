import { useRecoilValue, useSetRecoilState } from "recoil";
import { activeSubmissionIdState, activeSubmissionResultSelector } from "@repo/store";
import { Button } from "@repo/ui/shad/ui";
import { ArrowLeft } from "lucide-react";
import AcceptedSubmissionResult from "./AcceptedSubmissionResult";
import WrongSubmissionResult from "./WrongSubmissionResult";
import ErrorSubmissionResult from "./ErrorSubmissionResult";
import { Editor } from "@monaco-editor/react";

const renderSubmissionDetails = (submissionResult: any) => {
  switch (submissionResult.statusId) {
    case 3:
      return <AcceptedSubmissionResult />;
    case 4:
      return <WrongSubmissionResult />;
    default:
      return <ErrorSubmissionResult />;
  }
};

const SubmissionDetail = () => {
  const setActiveSubmissionId = useSetRecoilState(activeSubmissionIdState);
  const submissionDetails = useRecoilValue(activeSubmissionResultSelector);

  if (submissionDetails) {
    const { language, code } = submissionDetails;
    return (
      <>
        <Button variant="ghost" onClick={() => setActiveSubmissionId(null)}>
          <ArrowLeft size={16} className="mr-2" /> All submissions{" "}
        </Button>

        {renderSubmissionDetails(submissionDetails)}

        <div className="p-4">
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
      </>
    );
  }
};

export default SubmissionDetail;
