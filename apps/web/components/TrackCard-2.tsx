import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Track, Problem } from "@prisma/client";
import { TrackPreview } from "./TrackPreview";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface TrackCardProps extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export function TrackCard2({ track }: { track: TrackCardProps }) {
  const router = useRouter();
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handleTrackClick = () => {
    if (track.trackType === "CANVA") {
      const searchParams = new URLSearchParams();
      if (track.canvaLink) {
        searchParams.set("canvaLink", track.canvaLink);
        searchParams.set("title", track.title);
      }
      router.push(`/canva-track/${track.id}?${searchParams.toString()}`);
    } else {
      setShowPreview(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          controls.start("visible");
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1, ease: "easeOut" } },
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={variants}
        className="group relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-neutral-900 dark:via-blue-950/20 dark:to-purple-950/20 border border-primary/10 hover:border-blue-500/30 dark:hover:border-blue-400/30 flex cursor-pointer flex-row items-start justify-between gap-4 rounded-2xl p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 md:items-center overflow-hidden"
        onClick={handleTrackClick}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img src={track.image} alt={track.title} className="size-24 aspect-square object-cover rounded-2xl shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-500 ring-2 ring-primary/5 group-hover:ring-blue-500/20 relative z-10" />
        <div className="flex flex-col md:flex-row gap-4 w-full md:items-center justify-between relative z-10">
          <div className="flex flex-col gap-3">
            <h3 className="text-xl md:text-2xl tracking-tight font-bold lg:line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{track.title}</h3>
            <div className="flex flex-wrap gap-2">
              {track.categories.map((item) => (
                <span
                  key={item.category.id}
                  className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-400/20 rounded-full px-4 py-1.5 text-xs font-medium cursor-default hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                >
                  {item.category.category}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-3 w-full md:w-[30%] md:items-end items-center">
            <p className="text-primary/90 md:text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-bold">
              {track.problems.length} Chapters
            </p>
            <p className="flex tracking-tight gap-2 text-primary/60 text-sm md:text-base font-medium">
              {formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </motion.div>
      <TrackPreview showPreview={showPreview} setShowPreview={setShowPreview} track={track} />
    </>
  );
}
