"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./shad/ui/card";
import { Button } from ".";
import { MCQQuestion } from "@prisma/client";

const MCQQuestion = ({ question }: { question: MCQQuestion }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) {
      return;
    }
    if (selectedOption === option) {
      setSelectedOption(null);
      return;
    }
    setSelectedOption(option);
    setIsCorrect(null);
  };

  const handleOnSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === question.correctOption) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div>
      <Card className="my-4">
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {question.options.map((option, index) => (
            <Button
              className={
                "m-2 justify-start" +
                (selectedOption === option ? " bg-blue-500 hover:bg-blue-500" : "") +
                (isSubmitted && option === question.correctOption ? " bg-green-500 hover:bg-green-500" : "") +
                (isSubmitted && option !== question.correctOption && selectedOption === option
                  ? " bg-red-500 hover:bg-red-500"
                  : "")
              }
              variant={"outline"}
              key={index}
              onClick={() => handleOptionSelect(option)}
            >
              {`${index + 1} : ${option}`}
            </Button>
          ))}
        </CardContent>
        <CardFooter className="justify-between">
          <Button disabled={isSubmitted} onClick={handleOnSubmit}>
            Submit
          </Button>
          {isCorrect !== null && (
            <p>
              {isCorrect ? (
                <p className="text-green-400">Correct Answer!</p>
              ) : (
                <p className="text-red-500">Incorrect Answer!</p>
              )}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MCQQuestion;
