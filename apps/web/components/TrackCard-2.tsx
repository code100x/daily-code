import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Track, Problem } from "@prisma/client";
import { TrackPreview } from "./TrackPreview";
import { formatDistanceToNow } from "date-fns";

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
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

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
        className="flex items-start flex-row gap-4 cursor-pointer transition-all  bg-primary/5 backdrop-blur-xl duration-300 hover:-translate-y-1 rounded-xl p-4 justify-between md:items-center"
        onClick={() => setShowPreview(true)}
      >
        <img src={track.image} alt={track.title} className="size-20 aspect-square object-cover rounded-xl" />
        <div className="flex flex-col md:flex-row gap-4 w-full md:items-center justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl md:text-2xl tracking-tighter font-semibold lg:line-clamp-1">{track.title}</h3>
            {track.categories.map((item) => (
              <p
                key={item.category.id}
                className="bg-secondary/25 border border-primary/10 rounded-lg px-3 py-2 text-sm w-fit cursor-default"
              >
                {item.category.category}
              </p>
            ))}
          </div>
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-[30%] md:items-end items-center">
            <p className="text-primary/80 md:text-lg tracking-tight text-blue-500 font-semibold">
              {track.problems.length} Chapters
            </p>
            <p className="flex tracking-tight gap-2 text-primary/60 text-sm md:text-base">
              {formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </motion.div>
      <TrackPreview showPreview={showPreview} setShowPreview={setShowPreview} track={track} />
    </>
  );
}
