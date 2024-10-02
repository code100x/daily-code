import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "../../../../packages/db/src/index";
import Link from "next/link";
import { Suspense } from "react";
import { LoadingBookmarks } from "../../components/bookmarks/LoadingBookmarks";
import { BookmarkList } from "../../components/bookmarks/BookMarkList";
import { cache } from "react";

const getBookmarks = cache(async (userId: string) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      track: {
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
        },
      },
      problem: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookmarks.map((bookmark) => ({
    ...bookmark,
    createdAt: bookmark.createdAt.toISOString(),
  }));
});

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
        <p className="mb-4">Please log in to view your bookmarks.</p>
        <Link href="/auth" className="text-blue-500 hover:underline">
          Log In
        </Link>
      </div>
    );
  }

  const bookmarks = await getBookmarks(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Bookmarks</h1>
      <Suspense fallback={<LoadingBookmarks />}>
        <BookmarkList bookmarks={bookmarks} />
      </Suspense>
    </div>
  );
}
