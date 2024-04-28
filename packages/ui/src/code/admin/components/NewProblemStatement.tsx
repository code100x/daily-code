"use client";
import { ProblemStatement } from "@prisma/client";
import ProblemStatementForm from "../ProblemStatementForm";
import { useState } from "react";

const NewProblemStatement = () => {
  const [newProblemStatement, setNewProblemStatement] = useState<ProblemStatement>({
    id: "",
    argumentNames: [""],
    mainFuncName: "",
    problemId: "",
  });
  return (
    <div>
      <ProblemStatementForm
        problemStatement={{
          ...newProblemStatement,
          languagesSupported: [],
          testCases: [],
          argumentNames: [],
          problem: { id: "", description: "", notionDocId: "", title: "", type: "Code" },
        }}
        isNew={true}
      />
    </div>
  );
};

export default NewProblemStatement;
