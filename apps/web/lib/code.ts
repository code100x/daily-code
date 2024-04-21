const successfulSubmissions = [];

interface Submission {
  token: string;
  status: {
    id: number;
  };
}

interface BatchSubmissionResponse {
  submissions: Submission[];
}

const [backoffDelay, backoffMaxRetries] = [
  process.env.CODE_SUBMISSION_BACKOFF_DELAY || 1000,
  process.env.CODE_SUBMISSION_BACKOFF_MAX_RETRIES || 5,
];

export const fetchSubmissions = async (
  tokenString: string,
  resolve: (value: Submission[] | PromiseLike<Submission[]>) => void,
  delay: number = Number(backoffDelay),
  maxRetries: number = Number(backoffMaxRetries),
  retryCount: number = 0
) => {
  const subRes = await fetch(`${process.env.JUDGE0_API_URL}/submissions/batch?tokens=${tokenString}`);

  const newData: BatchSubmissionResponse = await subRes.json();

  const processingSubmissions = newData.submissions.filter((submission) => submission.status.id <= 2);
  const processedSubmissions = newData.submissions.filter((submission) => submission.status.id > 2);

  successfulSubmissions.push(...processedSubmissions);

  if (processingSubmissions.length > 0) {
    tokenString = processingSubmissions.map((submission) => submission.token).join(",");
    if (retryCount >= maxRetries) {
      console.error("Maximum number of retries reached.");
      resolve([]);
      return;
    }

    const nextDelay = Math.pow(2, retryCount) * delay; // Added backoff

    setTimeout(() => fetchSubmissions(tokenString, resolve, delay, maxRetries, retryCount + 1), nextDelay);
  } else {
    return resolve(processedSubmissions);
  }
};

export const processSubmissionData = ({
  languageId,
  sourceCode,
  problemStatementId,
  userId,
  processedSubmissions,
  tokenMap,
}: {
  languageId: number;
  sourceCode: string;
  problemStatementId: string;
  userId: string;
  processedSubmissions: any;
  tokenMap: any;
}) => {
  let runtime = 0;
  let memoryUsage = 0;
  let failedSubmission: any = null;
  let testCasesPassed = 0;
  let lastTestCase: any = null;

  processedSubmissions.forEach((submission: any) => {
    runtime += parseFloat(submission.time) * 1000;
    memoryUsage += submission.memory;
    if (submission.status.id > 3 && !failedSubmission) {
      failedSubmission = submission;
      lastTestCase = tokenMap[submission.token];
    } else if (submission.status.id === 3) {
      testCasesPassed += 1;
    }
  });

  return {
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
    userId,
  };
};
