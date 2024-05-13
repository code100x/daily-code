"use client";
import { useEffect, useState } from "react";
import { getAllMCQs } from "../utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import { Problem, MCQQuestion } from "@prisma/client";
import AdminAddMCQ from "./AdminAddMCQ";

interface AdminAddMCQProps extends Problem {
  mcqQuestions: MCQQuestion[];
}

const AdminMCQ = () => {
  const [Problems, setProblems] = useState<AdminAddMCQProps[]>([]);
  useEffect(() => {
    async function fetchMCQs() {
      const Problems = await getAllMCQs();
      setProblems(Problems);
    }
    fetchMCQs();
  }, []);
  return (
    <div className="flex justify-center">
      <div className="w-2/3 space-y-4 mt-5">
        {Problems.map((problem) => (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{problem.id}</CardTitle>
                  <CardTitle>{problem.title}</CardTitle>
                </div>
                <div className="flex gap-4 items-center">
                  <AdminAddMCQ problem={problem} />
                </div>
              </div>
              <CardDescription>{problem.description}</CardDescription>
              <CardDescription>{problem.type}</CardDescription>
            </CardHeader>
            <CardContent>{problem.notionDocId}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminMCQ;
