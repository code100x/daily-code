import { Problem } from "@prisma/client";
import MCQQuestion from "./MCQQuestion";
import db from "db/client";

async function MCQQuestionCard({ problem }: { problem: Problem }) {
  const questions = await db.mCQQuestion.findMany({
    where: {
      problemId: problem.id,
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold">Multiple Choice Question (MCQ)</h2>
      <p className="text-gray-500 dark:text-gray-400">Select the correct answer by clicking on the radio button.</p>
      {questions.map((question, index) => (
        <MCQQuestion key={index} question={question} />
      ))}
    </div>
  );
}

export default MCQQuestionCard;
