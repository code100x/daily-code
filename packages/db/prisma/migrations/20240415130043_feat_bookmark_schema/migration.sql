-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "track" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_track_fkey" FOREIGN KEY ("track") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
