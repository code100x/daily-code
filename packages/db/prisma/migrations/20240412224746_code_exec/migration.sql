-- CreateTable
CREATE TABLE "ProblemStatement" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "mainFuncName" TEXT NOT NULL,
    "argumentNames" TEXT[],

    CONSTRAINT "ProblemStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "problemStatementId" TEXT NOT NULL,
    "inputs" TEXT[],

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeLanguage" (
    "id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "CodeLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeLanguageId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "statusDesc" TEXT NOT NULL,
    "runtime" INTEGER NOT NULL,
    "memoryUsage" INTEGER NOT NULL,
    "errorMessage" TEXT,
    "testCasesPassed" INTEGER NOT NULL,
    "problemStatementId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastTestCaseId" TEXT,
    "stdout" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CodeLanguageToProblemStatement" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemStatement_problemId_key" ON "ProblemStatement"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "_CodeLanguageToProblemStatement_AB_unique" ON "_CodeLanguageToProblemStatement"("A", "B");

-- CreateIndex
CREATE INDEX "_CodeLanguageToProblemStatement_B_index" ON "_CodeLanguageToProblemStatement"("B");

-- AddForeignKey
ALTER TABLE "ProblemStatement" ADD CONSTRAINT "ProblemStatement_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "ProblemStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_codeLanguageId_fkey" FOREIGN KEY ("codeLanguageId") REFERENCES "CodeLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "ProblemStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_lastTestCaseId_fkey" FOREIGN KEY ("lastTestCaseId") REFERENCES "TestCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CodeLanguageToProblemStatement" ADD CONSTRAINT "_CodeLanguageToProblemStatement_A_fkey" FOREIGN KEY ("A") REFERENCES "CodeLanguage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CodeLanguageToProblemStatement" ADD CONSTRAINT "_CodeLanguageToProblemStatement_B_fkey" FOREIGN KEY ("B") REFERENCES "ProblemStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
