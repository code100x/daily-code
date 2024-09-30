"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Redo, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Track, Problem, UserProgress, Categories } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Button, Dialog, DialogContent } from "@repo/ui";

interface TrackPreviewProps {
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
  track: Track & {
    problems: Problem[];
    categories: {
      category: Categories;
    }[];
  };
  isCompleted: boolean;
  lastVisitedProblem: UserProgress | null;
  userProgress: UserProgress[];
}

const truncateDescription = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + " ...";
  }
  return text;
};

export function TrackPreview({
  showPreview,
  setShowPreview,
  track,
  isCompleted,
  lastVisitedProblem,
  userProgress,
}: TrackPreviewProps) {
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(false);
  const { data: session } = useSession();
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [lastVisited, setLastVisited] = useState<string | null>(null);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMediumOrLarger(window.innerWidth >= 768);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  useEffect(() => {
    if (session?.user) {
      setCompletedProblems(userProgress.filter((p) => p.completed).map((p) => p.problemId));
      setLastVisited(lastVisitedProblem?.problemId || null);
    }
  }, [session, track.id, userProgress, lastVisitedProblem]);

  const truncatedDescription = isMediumOrLarger ? track.description : truncateDescription(track.description, 15);

  const progressPercentage = (completedProblems.length / track.problems.length) * 100;

  return (
    <Dialog open={showPreview} onOpenChange={() => setShowPreview(false)}>
      <DialogContent className="flex items-center gap-4">
        <div className="flex w-full flex-col gap-4">
          <img src={track.image} className="h-[25vh] w-full rounded-lg object-cover" alt={track.title} />
          <div className="bg-primary/5 flex flex-col gap-4 rounded-lg p-4">
            <div className="flex flex-col gap-4">
              <h3 className="w-full text-xl font-semibold tracking-tight md:text-2xl">{track.title}</h3>
              <div className="flex items-center gap-4">
                {track.categories.map((item) => (
                  <p
                    key={item.category.id}
                    className="bg-secondary/25 border-primary/10 w-fit cursor-default rounded-lg border px-3 py-2 text-sm"
                  >
                    {item.category.category}
                  </p>
                ))}
              </div>
            </div>
            <p className="text-primary/60 line-clamp-3 tracking-tighter md:text-lg">{truncatedDescription}</p>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="text-primary flex gap-2 text-lg font-semibold tracking-tighter md:text-xl">
                {track.problems.length} Chapters
              </p>
              <p className="text-primary/60 flex gap-2 tracking-tight md:text-lg">
                {formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex max-h-[25vh] w-full flex-col gap-3 overflow-y-auto py-2">
              {track.problems.map((topic) => (
                <Link key={topic.id} href={`/tracks/${track.id}/${topic.id}`}>
                  <div className="bg-primary/5 hover:bg-primary/10 flex w-full cursor-pointer items-center justify-between scroll-smooth rounded-lg px-4 py-3 transition-all duration-300 hover:-translate-y-1">
                    {topic.title}
                    {completedProblems.includes(topic.id) ? (
                      <CheckCircle className="size-4 text-green-500" />
                    ) : (
                      <ArrowRight className="size-4" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {progressPercentage.toFixed(0)}% Complete
              </span>
            </div>
            <div className="flex gap-2">
              <Link href={`/tracks/${track.id}/${track.problems[0]?.id}`}>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Play className="size-4" />
                  Start from beginning
                </Button>
              </Link>
              {lastVisited && lastVisited !== track.problems[0]?.id && (
                <Link href={`/tracks/${track.id}/${lastVisited}`}>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Redo className="size-4" />
                    Resume
                  </Button>
                </Link>
              )}
              {isCompleted && (
                <Button size="sm" variant="outline" className="flex items-center gap-2" disabled>
                  <CheckCircle className="size-4" />
                  Completed
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
