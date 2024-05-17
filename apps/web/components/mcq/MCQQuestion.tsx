"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Button } from "@repo/ui";
import { MCQQuestion as Question } from "@prisma/client";

const MCQQuestion = ({
  question,
  setAtempted,
  isReset,
  isSubmitted,
  setisSubmitted,
}: {
  question: Question;
  setAtempted: Dispatch<SetStateAction<Object>>;
  isReset: boolean;
  isSubmitted: boolean;
  setisSubmitted: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) {
      return;
    }
    if (selectedOption === option) {
      setAtempted((prev) => ({ ...prev, [question.id]: false }));
      setSelectedOption(null);
      return;
    }
    setSelectedOption(option);
    setAtempted((prev) => ({ ...prev, [question.id]: option == question.correctOption }));
    setIsCorrect(null);
  };

  useEffect(() => {
    if (isSubmitted) {
      handleOnSubmit();
    }
  }, [isSubmitted]);

  const handleOnSubmit = () => {
    setisSubmitted(true);
    if (selectedOption === question.correctOption) {
    } else {
      setIsCorrect(false);
    }
  };

  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setisSubmitted(false);
  }, [isReset]);

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
