import { ReactNode } from "react";

const MCQQuestionCard = ({
  children,
  questionNo,
  questionText,
}: {
  children: ReactNode;
  questionNo: number;
  questionText: string;
}) => {
  return (
    <div className="rounded shadow-md border-2 w-full p-4 flex flex-col gap-3">
      <p className="mb-3 font-bold">
        Q{questionNo + 1}. {questionText}
      </p>
      {children}
    </div>
  );
};

export default MCQQuestionCard;
