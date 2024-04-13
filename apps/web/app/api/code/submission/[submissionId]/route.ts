import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

export async function GET(req: NextRequest, { params: { submissionId } }: { params: { submissionId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const submission = await db.submission.findUnique({
    where: {
      id: submissionId,
      userId,
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
