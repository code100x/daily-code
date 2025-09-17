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
        className="glass-card-premium hover-lift shadow-soft hover:shadow-medium shimmer hover-glow group relative flex cursor-pointer flex-row items-start justify-between gap-4 overflow-hidden rounded-xl p-5 md:items-center"
        onClick={handleTrackClick}
      >
        <img
          src={track.image}
          alt={track.title}
          className="shadow-soft hover:shadow-medium aspect-square size-20 rounded-xl object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <h3 className="gradient-text-rainbow text-glow text-xl font-semibold tracking-tighter transition-all duration-500 group-hover:scale-105 md:text-2xl lg:line-clamp-1">
              {track.title}
            </h3>
            {track.categories.map((item) => (
              <p
                key={item.category.id}
                className="glass-card-premium border-primary/15 shadow-soft hover:shadow-medium hover-glow shimmer w-fit cursor-default rounded-lg border px-3 py-2 text-sm transition-all duration-500"
              >
                {item.category.category}
              </p>
            ))}
          </div>
          <div className="flex w-full flex-row items-center gap-2 md:w-[30%] md:flex-col md:items-end">
            <p className="gradient-text-rainbow text-glow hover-lift font-semibold tracking-tight md:text-lg">
              {track.problems.length} Chapters
            </p>
            <p className="text-primary/60 flex gap-2 text-sm tracking-tight md:text-base">
              {formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </motion.div>
      <TrackPreview showPreview={showPreview} setShowPreview={setShowPreview} track={track} />
    </>
  );
}
