"use client";
import { useMemo } from "react";
import { Button } from "@repo/ui";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookmarkIcon } from "lucide-react";
import useSWR from "swr";

interface BookmarkButtonProps {
  trackId: string;
  problemId: string | undefined;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useBookmarkStatus = (trackId: string, problemId: string | undefined) => {
  const { data: session } = useSession();
  const shouldFetch = session && trackId && problemId;
  const { data, error, mutate } = useSWR(
    shouldFetch ? `/api/bookmarks?trackId=${trackId}&problemId=${problemId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    isBookmarked: data?.isBookmarked,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export function BookmarkButton({ trackId, problemId }: BookmarkButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { isBookmarked, mutate } = useBookmarkStatus(trackId, problemId);

  const handleBookmark = async () => {
    if (!session) {
      router.push("/auth");
      return;
    }

    try {
      const response = await fetch("/api/bookmarks", {
        method: isBookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, problemId }),
      });

      if (response.ok) {
        mutate();
      } else {
        const errorData = await response.json();
        console.error("Failed to toggle bookmark", errorData);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    }
  };

  const buttonContent = useMemo(
    () => (
      <>
        <BookmarkIcon className={isBookmarked ? "text-blue-500" : "text-gray-500"} />
        {isBookmarked ? "Unbookmark" : "Bookmark"}
      </>
    ),
    [isBookmarked]
  );

  return <Button onClick={handleBookmark}>{buttonContent}</Button>;
}
