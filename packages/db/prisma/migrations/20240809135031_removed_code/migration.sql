/*
  Warnings:

  - The values [Code] on the enum `ProblemType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `CodeLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProblemStatement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestCase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CodeLanguageToProblemStatement` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProblemType_new" AS ENUM ('Blog', 'MCQ');
ALTER TABLE "Problem" ALTER COLUMN "type" TYPE "ProblemType_new" USING ("type"::text::"ProblemType_new");
ALTER TYPE "ProblemType" RENAME TO "ProblemType_old";
ALTER TYPE "ProblemType_new" RENAME TO "ProblemType";
DROP TYPE "ProblemType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ProblemStatement" DROP CONSTRAINT "ProblemStatement_problemId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_codeLanguageId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_lastTestCaseId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problemStatementId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_userId_fkey";

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_problemStatementId_fkey";

-- DropForeignKey
ALTER TABLE "_CodeLanguageToProblemStatement" DROP CONSTRAINT "_CodeLanguageToProblemStatement_A_fkey";

-- DropForeignKey
ALTER TABLE "_CodeLanguageToProblemStatement" DROP CONSTRAINT "_CodeLanguageToProblemStatement_B_fkey";

-- DropTable
DROP TABLE "CodeLanguage";

-- DropTable
DROP TABLE "ProblemStatement";

-- DropTable
DROP TABLE "Submission";

-- DropTable
DROP TABLE "TestCase";

-- DropTable
DROP TABLE "_CodeLanguageToProblemStatement";
