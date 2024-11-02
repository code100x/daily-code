-- CreateEnum
CREATE TYPE "TrackType" AS ENUM ('NOTION', 'CANVA');

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "canvaLink" TEXT,
ADD COLUMN     "trackType" "TrackType" NOT NULL DEFAULT 'NOTION';
