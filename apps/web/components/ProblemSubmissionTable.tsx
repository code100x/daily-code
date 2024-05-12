"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/shad/ui";
import { Clock4, CodeXml } from "lucide-react";
import { useRouter } from "next/navigation";
import { Submission } from "@prisma/client";
import { ProblemStatement } from "@prisma/client";

interface ProblemSubmissionTableProps {
  problemStatements: ProblemStatement[];
}

export default function ProblemSubmissionTable({ problemStatements }: ProblemSubmissionTableProps) {
  function getTimeFromDateTime(dateTime: Date) {
    const now = new Date();
    const diffInMs = now.getTime() - dateTime.getTime();

    // Handle edge cases for "just now" and "a minute ago"
    if (diffInMs < 60000) {
      // Less than a minute
      return "just now";
    } else if (diffInMs < 120000) {
      // Between 1 and 2 minutes
      return "a minute ago";
    }

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days === 1) {
      return "yesterday";
    } else if (days > 1) {
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(dateTime);
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    }
  }

  problemStatements.sort((a: any, b: any) => {
    const latestSubmissionA = a.submissions
      .filter((sub: Submission) => sub.statusId <= 3)
      .sort((x: Submission, y: Submission) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime())[0];
    const latestSubmissionB = b.submissions
      .filter((sub: Submission) => sub.statusId <= 3)
      .sort((x: Submission, y: Submission) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime())[0];

    return new Date(latestSubmissionB.createdAt).getTime() - new Date(latestSubmissionA.createdAt).getTime();
  });

  const router = useRouter();
  return (
    <div className="p-4 flex flex-col text-[#CCC]">
      {problemStatements && problemStatements?.length > 0 ? (
        <div className="min-h-[20rem]  mb-4">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">
                  <div className="flex  items-center gap-2">
                    <span>Problem</span>
                    <CodeXml color={"#3b82f6"} size={18} />
                  </div>
                </TableHead>

                <TableHead className="flex items-center gap-2">
                  <span>Submitted</span>
                  <Clock4 color={"#3b82f6"} size={16} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problemStatements?.map(({ id, problem, problemId, submissions }: any) => {
                return (
                  <TableRow
                    key={id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/tracks/${problem.trackProblems[0].trackId}/${problemId}`)}
                  >
                    <TableCell className="w-[75%]">
                      <div className="text-sm rounded-full text-black dark:text-white px-2 py-2 font-semibold max-w-full">
                        {problem.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-black text-center dark:text-white">
                        {submissions.length > 0 &&
                          getTimeFromDateTime(
                            submissions
                              .filter((sub: Submission) => sub.statusId >= 1 && sub.statusId <= 3)
                              .sort(
                                (a: Submission, b: Submission) =>
                                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                              )
                              .map((sub: Submission) => sub.createdAt)[0]
                          )}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="h-[20rem] flex items-center justify-center mb-4 border-2">No Submission Yet!</div>
      )}
    </div>
  );
}
