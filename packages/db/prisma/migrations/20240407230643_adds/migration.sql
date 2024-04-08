/*
  Warnings:

  - Added the required column `sortingOrder` to the `TrackProblems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrackProblems" ADD COLUMN     "sortingOrder" INTEGER NOT NULL;
