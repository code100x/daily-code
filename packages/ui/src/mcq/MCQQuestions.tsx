"use client";
import { Button } from "..";
import { MCQQuestion } from "@prisma/client";
import { MCQSelectedOptions } from "../../../store/src/atoms";
import MCQOption from "./MCQOption";
import MCQQuestionCard from "./MCQQuestionCard";

const MCQQuestions = ({
  mcqQuestions,
  selectedOptions,
  onOptionClick,
  onSubmit,
}: {
  mcqQuestions: MCQQuestion[];
  selectedOptions: MCQSelectedOptions;
  onOptionClick: (quesId: string, optionIndex: number) => void;
  onSubmit: () => void;
}) => {
  return (
    <>
      {mcqQuestions.map(({ question, options, id: quesId }, index) => {
        return (
          <MCQQuestionCard questionNo={index} questionText={question} key={quesId}>
            {options.map((option, index) => {
              const isOptionSelected = selectedOptions[quesId] === index;
              return (
                <MCQOption
                  isOptionSelected={isOptionSelected}
                  option={option}
                  disabled={false}
                  onClick={() => onOptionClick(quesId, index)}
                />
              );
            })}
          </MCQQuestionCard>
        );
      })}
      <Button
        variant="default"
        disabled={Object.keys(selectedOptions).length !== mcqQuestions.length}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </>
  );
};

export default MCQQuestions;
