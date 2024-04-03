"use client";
import { Button } from "..";
import { cn } from "../../lib/utils";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
const MCQOption = ({
  option,
  isOptionSelected,
  isCorrectOption = false,
  isWrongOption = false,
  disabled,
  onClick,
}: {
  option: string;
  isOptionSelected: boolean;
  isCorrectOption?: boolean;
  isWrongOption?: boolean;
  disabled: boolean;
  onClick?: () => void;
}) => {
  return (
    <Button
      variant={"outline"}
      className={cn(
        isCorrectOption || isOptionSelected
          ? "disabled:opacity-100 border-green-700 dark:border-green-300 border-2"
          : "",
        isWrongOption ? "disabled:opacity-100 border-red-700 dark:border-red-400 border-2" : "",
        "bg-gray-300 dark:bg-gray-900 w-full text-left relative"
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {option}
      {isWrongOption && (
        <div className="absolute top-1/2 -translate-y-1/2 left-2">
          <CrossCircledIcon className=" text-red-700 dark:text-red-400" />
        </div>
      )}
      {isCorrectOption && (
        <div className="absolute top-1/2 -translate-y-1/2 left-2">
          <CheckCircledIcon className=" text-green-700 dark:text-green-300" />
        </div>
      )}
    </Button>
  );
};

export default MCQOption;
