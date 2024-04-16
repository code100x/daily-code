/*
  Warnings:

  - You are about to drop the column `trackId` on the `Categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_trackId_fkey";

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "trackId";

-- CreateTable
CREATE TABLE "TrackCategory" (
    "trackId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "TrackCategory_pkey" PRIMARY KEY ("trackId","categoryId")
);

-- AddForeignKey
ALTER TABLE "TrackCategory" ADD CONSTRAINT "TrackCategory_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackCategory" ADD CONSTRAINT "TrackCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
