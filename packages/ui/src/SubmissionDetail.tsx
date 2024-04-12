import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { activeSubmissionIdState, submissionResultState } from "../../store/src/atoms";
import { Button } from "./shad/ui/button";
import { ArrowLeft } from "lucide-react";
import AcceptedSubmissionResult from "./AcceptedSubmissionResult";
import WrongSubmissionResult from "./WrongSubmissionResult";
import ErrorSubmissionResult from "./ErrorSubmissionResult";

const renderSubmissionDetails = (submissionResult: any) => {
  switch (submissionResult.statusId) {
    case 3:
      return <AcceptedSubmissionResult submissionResult={submissionResult} />;
    case 4:
      return <WrongSubmissionResult submissionResult={submissionResult} />;
    default:
      return <ErrorSubmissionResult submissionResult={submissionResult} />;
  }
};

const SubmissionDetail = () => {
  const [activeSubmissionId, setActiveSubmissionId] = useRecoilState(activeSubmissionIdState);

  const submissionResult = useRecoilValue(submissionResultState);

  if (submissionResult && submissionResult[activeSubmissionId]) {
    const submissionDetails = submissionResult[activeSubmissionId];
    return (
      <>
        <Button variant="ghost" onClick={() => setActiveSubmissionId(null)}>
          <ArrowLeft size={16} className="mr-2" /> All submissions{" "}
        </Button>
        {renderSubmissionDetails(submissionDetails)}
      </>
    );
  }
};

export default SubmissionDetail;
