import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Track, Problem } from "@prisma/client";
import { TrackPreview } from "./TrackPreview";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@repo/ui";
import Link from "next/link";

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
          <div className="flex items-center gap-10 md:w-[40%]">
            <div className="flex w-full flex-row items-center gap-2 md:flex-col md:items-end">
              <p className="text-primary/80 font-semibold tracking-tight text-blue-500 md:text-lg">
                {track.problems.length} Chapters
              </p>
              <p className="text-primary/60 flex gap-2 text-sm tracking-tight md:text-base">
                {formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div>
              <Link href={track.problems.length ? `/tracks/${track.id}/${track.problems[0]?.id}` : ""}>
                <Button
                  size={"lg"}
                  className="flex items-center justify-center bg-blue-600 text-white transition-all duration-300 hover:bg-blue-500 py-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  Start
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
      <TrackPreview showPreview={showPreview} setShowPreview={setShowPreview} track={track} />
    </>
  );
}
