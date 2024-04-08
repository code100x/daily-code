-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
