import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";

const getInputString = (args: string[], funcName: string) => {
  return `\n
console.log(${funcName}(${args.join(",")}))
`;
};

let successfulSubmissions: any[] = [];

async function fetchSubmissions(tokenString: string, resolve: (value: any[] | PromiseLike<any[]>) => void) {
  // Fetch submissions with the tokenString
  const subRes = await fetch(`http://localhost:2358/submissions/batch?tokens=${tokenString}`);

  // Parse the response
  const newData = await subRes.json();

  // Separate submissions based on status id
  const processingSubmissions = newData.submissions.filter((submission: any) => submission.status.id <= 2);
  const processedSubmissions = newData.submissions.filter((submission: any) => submission.status.id > 2);

  // Move submissions with status id > 2 to another array
  successfulSubmissions = [...successfulSubmissions, ...processedSubmissions];

  // Check if any moved submissions with status id > 2
  if (processingSubmissions.length > 0) {
    // Create a new token string for submissions with status id <= 2
    tokenString = processingSubmissions.map((submission: any) => submission.token).join(",");

    // Fetch new submissions recursively after a delay
    setTimeout(() => fetchSubmissions(tokenString, resolve), 1000); // Fetch data after 5 seconds
  } else {
    return resolve(processedSubmissions);
  }
}

export async function POST(req: NextRequest) {
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

  const API_URL = `http://localhost:2358/submissions/batch`;
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

  const processedSubmission = await new Promise<any[]>((resolve) => {
    setTimeout(async () => {
      fetchSubmissions(tokenString, resolve);
    }, 1000);
  });

  let runtime = 0;
  let memoryUsage = 0;
  let failedSubmission: any = null;
  let testCasesPassed = 0;
  let lastTestCase: any = null;
  processedSubmission.forEach((submission, index) => {
    console.log("submission", submission.status);

    runtime += parseFloat(submission.time) * 1000;
    memoryUsage += submission.memory;
    if (submission.status.id > 3) {
      if (!failedSubmission) {
        failedSubmission = submission;
        lastTestCase = tokenMap[submission.token];
      }
    } else {
      testCasesPassed += 1;
    }
  });

  const submission = await db.submission.create({
    data: {
      code: sourceCode,
      codeLanguageId: languageId,
      statusId: failedSubmission ? failedSubmission.status.id : 3,
      statusDesc: failedSubmission ? failedSubmission.status.description : "Accepted",
      runtime,
      memoryUsage,
      testCasesPassed,
      problemStatementId,
      errorMessage: failedSubmission?.stderr || null,
      lastTestCaseId: failedSubmission && lastTestCase ? lastTestCase.id : null,
      stdout: failedSubmission?.stdout || null,
    },
  });

  return NextResponse.json({ submissionId: submission.id });
}
