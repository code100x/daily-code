"use client";
import { MCQQuestion } from "@prisma/client";
import { MCQSelectedOptions } from "../../../store/src/atoms";
import { Button } from "@repo/ui/button";
import MCQOption from "./MCQOption";
import MCQQuestionCard from "./MCQQuestionCard";

const MCQSubmission = ({
  score,
  mcqQuestions,
  selectedOptions,
  onReset,
}: {
  score: number | null;
  mcqQuestions: MCQQuestion[];
  selectedOptions: MCQSelectedOptions;
  onReset: () => void;
}) => {
  let message;
  if (score === null) {
    message = "Submit to see your score.";
  } else if (score < 30) {
    message = `Your score is ${score}%. Keep practicing!`;
  } else if (score >= 30 && score < 70) {
    message = `Your score is ${score}%. You can improve!`;
  } else if (score >= 70 && score < 100) {
    message = `Your score is ${score}%. Well done!`;
  } else {
    message = "Congrats! You got a full score! 🎉";
  }

  return (
    <>
      <div className="font-bold text-2xl">{message}</div>
      <div className="font-bold text-lg mt-6">Your Submissions:</div>
      {mcqQuestions.map(({ question, options, correctOptionIndex, id: quesId }, index) => {
        const wrongAnswerSelected = selectedOptions[quesId] !== correctOptionIndex;
        return (
          <MCQQuestionCard questionNo={index} questionText={question}>
            {options.map((option, index) => {
              const isOptionSelected = selectedOptions[quesId] === index;
              const isCorrectOption = index === correctOptionIndex;
              const isWrongOption = wrongAnswerSelected && isOptionSelected;
              return (
                <MCQOption
                  isOptionSelected={isOptionSelected}
                  option={option}
                  disabled={false}
                  isCorrectOption={isCorrectOption}
                  isWrongOption={isWrongOption}
                />
              );
            })}
          </MCQQuestionCard>
        );
      })}
      <Button
        variant="default"
        disabled={Object.keys(selectedOptions).length !== mcqQuestions.length}
        onClick={onReset}
      >
        Reset
      </Button>
    </>
  );
};

export default MCQSubmission;
