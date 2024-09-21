import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { BookmarkButton } from "./BookMarkButton";
import { ChevronRight } from "lucide-react";

interface Bookmark {
  id: string;
  track: {
    id: string;
    title: string;
    description: string;
    image: string;
  };
  problem: {
    id: string;
    title: string;
  } | null;
  createdAt: string;
}

export function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="mb-4 text-lg">You haven't bookmarked any problems yet.</p>
        <Link href="/" className="rounded-full bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700">
          Explore Tracks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
          <div className="flex items-center p-6">
            <div className="mr-4 h-12 w-12 flex-shrink-0">
              <img
                src={bookmark.track.image || "/api/placeholder/48/48"}
                alt={bookmark.track.title}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{bookmark.track.title}</h3>
              {bookmark.problem && <p className="text-sm text-gray-600 dark:text-gray-400">{bookmark.problem.title}</p>}
            </div>
            <div className="ml-4 flex flex-col items-end">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                Bookmarked {formatDistanceToNow(new Date(bookmark.createdAt))} ago
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-100 p-4 dark:bg-gray-700">
            <BookmarkButton trackId={bookmark.track.id} problemId={bookmark.problem?.id} />
            {bookmark.problem && (
              <Link
                href={`/tracks/${bookmark.track.id}/${bookmark.problem.id}`}
                className="flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <span className="mr-2">Go to Problem</span>
                <ChevronRight size={20} />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
