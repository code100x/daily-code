"use client";

import { useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Track, Problem, UserProgress } from "@prisma/client";
import { TrackPreview } from "./TrackPreview";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

interface TrackCardProps extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export function TrackCard2({ track, userProgress }: { track: TrackCardProps; userProgress: UserProgress[] }) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { data: session } = useSession();

  const variants = {
    // hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1, ease: "easeOut" } },
  };

  const completedProblems = userProgress.filter((p) => p.completed).length;
  const progressPercentage = (completedProblems / track.problems.length) * 100;
  const isCompleted = progressPercentage === 100;

  const lastVisitedProblem =
    userProgress.length > 0
      ? userProgress.reduce((prev, current) => (prev.lastVisited > current.lastVisited ? prev : current))
      : null;

  return (
    <>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={variants}
        className="bg-primary/5 flex cursor-pointer flex-row items-start justify-between gap-4 rounded-xl p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 md:items-center"
        onClick={() => setShowPreview(true)}
      >
        <img src={track.image} alt={track.title} className="aspect-square size-20 rounded-xl object-cover" />
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold tracking-tighter md:text-2xl lg:line-clamp-1">{track.title}</h3>
            {track.categories.map((item) => (
              <p
                key={item.category.id}
                className="bg-secondary/25 border-primary/10 w-fit cursor-default rounded-lg border px-3 py-2 text-sm"
              >
                {item.category.category}
              </p>
            ))}
          </div>
          <div className="flex w-full flex-row items-center gap-2 md:w-[30%] md:flex-col md:items-end">
            <p className="text-primary/80 font-semibold tracking-tight text-blue-500 md:text-lg">
              {track.problems.length} Chapters
            </p>
            <p className="text-primary/60 flex gap-2 text-sm tracking-tight md:text-base">
              {formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })}
            </p>
            {(session?.user || userProgress.length > 0) && (
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <TrackPreview
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        track={track}
        isCompleted={isCompleted}
        lastVisitedProblem={lastVisitedProblem}
        userProgress={userProgress}
      />
    </>
  );
}
