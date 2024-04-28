import { Problem,MCQQuestion as mcq } from "@prisma/client";
import MCQQuestion from "./MCQQuestion";
import { useEffect, useState } from "react";
import { getAllMCQsForProblem } from "web/components/utils";
import { Button } from "../shad/ui/button";

function MCQQuestionCard({ problem }: { problem: Problem }) {
  const [questions, setQuestions] = useState<mcq[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await getAllMCQsForProblem(problem.id);
        setQuestions(questions);
      } catch (error) {
        console.error("Error fetching MCQ questions:", error);
        // Handle error gracefully, e.g., show an error message
      }
    };
    fetchQuestions();
  }, [problem.id]);

  const handleResetScore = () => {
    setIsReset(!isReset);
    setScore(0);
  };

  const handleSubmit = () => {
    // Submit the score to the backend
    setIsSubmitted(!isSubmitted);
  }


  return (
    <div>
    <h2 className="text-2xl font-bold">Multiple Choice Question (MCQ)</h2>
    <p className="text-gray-500 dark:text-gray-400">Select the correct answer.</p>
    <h3 className="text-xl font-semibold">Score: {score}/{questions.length}</h3>
    {questions.map((question, index) => (
      <MCQQuestion
        key={index}
        question={question}
        score={score}
        setScore={setScore}
        isReset={isReset}
        isSubmitted={isSubmitted}
        setisSubmitted={setIsSubmitted}
      />
    ))}
    <div className="flex justify-center">
      <Button className="m-4" disabled={isSubmitted} onClick={handleSubmit}>Submit</Button>
      <Button className="m-4" onClick={handleResetScore}>
        Reset Score
      </Button>
    </div>
  </div>
  );
}

export default MCQQuestionCard;
