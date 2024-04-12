import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";

export async function GET(req: NextRequest, { params: { submissionId } }: { params: { submissionId: string } }) {
  const submission = await db.submission.findUnique({
    where: {
      id: submissionId,
    },
    include: {
      problemStatement: {
        include: {
          testCases: true,
        },
      },
      language: true,
      lastTestCase: true,
    },
  });

  return NextResponse.json({ ...submission });
}
