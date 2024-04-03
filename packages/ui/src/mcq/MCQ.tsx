"use client";
import { BlogAppbar } from "../BlogAppbar";
import { NotionRenderer } from "../NotionRenderer";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { Track, Problem, MCQQuestion } from "@prisma/client";
import { MCQSelectedOptions } from "../../../store/src/atoms";
import MCQSubmission from "./MCQSubmission";
import MCQQuestions from "./MCQQuestions";

export const MCQ = ({
  problem,
  track,
  showAppBar,
  mcqQuestions,
}: {
  problem: Problem & { notionRecordMap: any };
  mcqQuestions: MCQQuestion[];
  track: Track & { problems: Problem[] };
  showAppBar?: Boolean;
}) => {
  const quizRef = useRef<HTMLDivElement>(null);

  const [selectedOptions, setSelectedOptions] = useState<MCQSelectedOptions>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState<null | number>(null);

  useEffect(() => {
    const submissions = JSON.parse(localStorage.getItem("submission") || "null");
    if (submissions && submissions[problem.id]) {
      const { score, selectedOptions } = submissions[problem.id];
      setScore(score);
      setSelectedOptions(selectedOptions);
      setIsSubmitted(true);
    }
  }, []);

  useEffect(() => {
    if (quizRef.current) {
      quizRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSubmitted, quizRef]);

  const handleOptionClick = (questionId: string, optionIndex: number) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const reset = () => {
    const submissions = JSON.parse(localStorage.getItem("submission") || "null");
    delete submissions[problem.id];
    localStorage.setItem("submission", JSON.stringify(submissions));
    setIsSubmitted(false);
    setSelectedOptions({});
  };

  const calculateScore = () => {
    const totalQuestions = mcqQuestions.length;

    const correctAnswers = Object.entries(selectedOptions).filter(([questionId]) => {
      const selectedOptionIndex = selectedOptions[questionId];
      const answerIndex = mcqQuestions.find((question) => question.id === questionId)?.correctOptionIndex;
      return selectedOptionIndex === answerIndex;
    }).length;

    return Math.floor((correctAnswers / totalQuestions) * 100);
  };

  const handleConfetti = (percentage: number) => {
    if (percentage === 100) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };
  // Usigng localstorage for temp solution
  const saveSubmission = (percentage: number) => {
    const submissions = JSON.parse(localStorage.getItem("submission") || "{}");
    const submissionObj = {
      selectedOptions,
      score: percentage,
    };
    if (submissions) {
      localStorage.setItem("submission", JSON.stringify({ ...submissions, [problem.id]: submissionObj }));
    } else {
      localStorage.setItem("submission", JSON.stringify({ [problem.id]: submissionObj }));
    }
  };

  const handleSubmit = () => {
    const percentage = calculateScore();
    setScore(percentage);
    handleConfetti(percentage);
    setIsSubmitted(true);
    saveSubmission(percentage);
  };

  return (
    <div>
      {showAppBar && <BlogAppbar problem={problem} track={track} />}
      <div className="grid grid-cols-3 h-[calc(100vh-64px)]">
        <div className="col-span-2 overflow-y-auto">
          <NotionRenderer recordMap={problem.notionRecordMap} />
        </div>
        <div
          className="col-span-1 overflow-y-auto flex flex-col px-8 p-4 gap-6 w-full relative overflow-x-hidden"
          ref={quizRef}
        >
          {showConfetti && <Confetti className="absolute !right-0 max-h-[60vh]" />}
          <h2 className="font-bold text-xl">Quiz</h2>
          {isSubmitted ? (
            <MCQSubmission
              score={score}
              selectedOptions={selectedOptions}
              mcqQuestions={mcqQuestions}
              onReset={reset}
            />
          ) : (
            <MCQQuestions
              selectedOptions={selectedOptions}
              mcqQuestions={mcqQuestions}
              onOptionClick={handleOptionClick}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};
