import { Problem, MCQQuestion as mcq } from "@prisma/client";
import MCQQuestion from "./MCQQuestion";
import { useEffect, useState } from "react";
import { Button, toast } from "@repo/ui";
import { useSession } from "next-auth/react";
import { createQuizScore, getAllMCQsForProblem } from "../utils";

function MCQCard({ problem }: { problem: Problem }) {
  const session = useSession();

  const [questions, setQuestions] = useState<mcq[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [atempted, setAtempted] = useState({});
  // @ts-ignore
  const userId = session.data?.user?.id;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await getAllMCQsForProblem(problem.id);
        setQuestions(questions);
      } catch (error) {
        console.error("Error fetching MCQ questions:", error);
      }
    };
    fetchQuestions();
  }, [problem.id]);

  const handleResetScore = () => {
    setAtempted({});
    setIsReset(!isReset);
    setScore(0);
  };

  const handleSubmit = (score: number) => {
    setIsSubmitted(!isSubmitted);
    function getScore(atempted: any) {
      let score = 0;
      for (const key in atempted) {
        if (atempted[key]) {
          score++;
        }
      }
      score = parseInt(((score / questions.length) * 100).toPrecision(3));
      return score;
    }
    setScore(getScore(atempted));

    console.log("in submit", score);
    async function submitQuiz() {
      try {
        let score = getScore(atempted);
        console.log("in submit", atempted);
        await createQuizScore({
          userId,
          score,
          problemId: problem.id,
        });
        toast({
          description: "Submitted Successfully",
        });
      } catch (error) {
        console.error("Error submitting quiz:", error);
        toast({
          description: "Failed to submit the quiz.",
        });
      }
    }
    toast({
      description: "Submitting...",
    });
    console.log("Submitting...");
    submitQuiz();
  };

  function giveFeedback() {
    let scoreP = parseInt(((score / questions.length) * 100).toPrecision(3));
    if (scoreP === 100) {
      return "Excellent! You aced the test!";
    } else if (scoreP >= 80) {
      return "Great job! You did very well.";
    } else if (scoreP >= 60) {
      return "Good effort! You passed with a solid score.";
    } else if (scoreP >= 50) {
      return "Keep practicing! You're on the right track.";
    } else {
      return "Keep at it! Let's review and improve.";
    }
  }
  useEffect(() => {
    setFeedback(giveFeedback());
  }, [score]);

  return (
    <div>
      <h2 className="text-2xl font-bold">Multiple Choice Question (MCQ)</h2>
      <p className="text-gray-500 dark:text-gray-400">Select the correct answer.</p>
      {questions.map((question, index) => (
        <MCQQuestion
          key={index}
          question={question}
          setAtempted={setAtempted}
          isReset={isReset}
          isSubmitted={isSubmitted}
          setisSubmitted={setIsSubmitted}
        />
      ))}
      {isSubmitted && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-2">Quiz Score</h2>
          <h3 className="text-4xl font-bold text-primary-500 mb-2">{score}%</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{feedback}</p>
        </div>
      )}
      <div className="flex justify-center">
        <Button className="m-4" disabled={isSubmitted} onClick={() => handleSubmit(score)}>
          Submit
        </Button>
        <Button className="m-4" onClick={handleResetScore}>
          Reset Score
        </Button>
      </div>
    </div>
  );
}

export default MCQCard;
