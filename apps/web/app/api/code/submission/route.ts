import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions, rateLimit } from "../../../../lib/auth";
import { fetchSubmissions, processSubmissionData } from "../../../../lib/code";

const [rateLimitCount, rateLimitInterval] = [
  process.env.CODE_SUBMISSION_RATE_LIMIT_COUNT || 5,
  process.env.CODE_SUBMISSION_RATE_LIMIT_INTERVAL || 60000,
];

const getInputString = (args: string[], funcName: string) => {
  return `\n
console.log(${funcName}(${args.join(",")}))
`;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    if (!rateLimit(userId, Number(rateLimitCount), Number(rateLimitInterval))) {
      return NextResponse.json({ message: "Rate Limit Exceeded. Please try again later." }, { status: 401 });
    }

    const { sourceCode, languageId, problemStatementId } = await req.json();

    const problemStatement = await db.problemStatement.findFirst({
      where: { id: problemStatementId },
      include: {
        testCases: true,
      },
    });

    if (!problemStatement) {
      return NextResponse.json({ message: "Problem Statement not found" }, { status: 400 });
    }

    const { testCases, mainFuncName } = problemStatement;

    const submissions = testCases.map((testCase) => {
      return {
        source_code: atob(sourceCode) + getInputString(testCase.inputs, mainFuncName),
        language_id: languageId,
        expected_output: testCase.expectedOutput,
      };
    });

    const API_URL = `${process.env.JUDGE0_API_URL}/submissions/batch`;
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        submissions,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: any[] = await res.json();

    const tokenMap: any = {};

    data.forEach((submission, index) => {
      tokenMap[submission.token] = testCases[index];
    });

    const tokenString = data.map((props: any) => props.token).join(",");

    const processedSubmissions = await new Promise<any[]>((resolve) => {
      setTimeout(async () => {
        fetchSubmissions(tokenString, resolve);
      }, 1000);
    });

    const submissionData =
      processedSubmissions.length > 0
        ? processSubmissionData({
            languageId,
            userId,
            sourceCode,
            tokenMap,
            problemStatementId,
            processedSubmissions,
          })
        : {
            code: sourceCode,
            codeLanguageId: languageId,
            statusId: 5,
            statusDesc: "Time Limit Exceeded",
            runtime: 0,
            memoryUsage: 0,
            testCasesPassed: 0,
            problemStatementId,
            errorMessage: null,
            lastTestCaseId: testCases[0]?.id,
            stdout: null,
            userId,
          };

    const submission = await db.submission.create({
      data: submissionData,
    });
    return NextResponse.json({ submissionId: submission.id });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "An error occurred. Please try again later." }, { status: 500 });
  }
}
