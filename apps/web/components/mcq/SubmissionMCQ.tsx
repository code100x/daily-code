import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Problem, QuizScore } from "@prisma/client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { getQuizScore } from "../utils";

const SubmissionMCQ = ({ problem }: { problem: Problem }) => {
  const session = useSession();
  // @ts-ignore
  const userId = session.data?.user?.id;
  const [scoreData, setScoreData] = useState<QuizScore[]>([]);

  useEffect(() => {
    async function fetchSubmission() {
      const data = await getQuizScore({
        userId,
        problemId: problem.id,
      });
      setScoreData(data);
    }
    fetchSubmission();
  }, []);

  return (
    <div>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Quiz Score</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scoreData.map((score) => (
            <TableRow key={score.id}>
              <TableCell>{score.score}</TableCell>
              <TableCell>
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date(score.createdAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionMCQ;
