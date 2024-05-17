"use client";

import { Problem, Track } from "@prisma/client";
import Link from "next/link";

export function TrackList({ track }: { track: Track & { problems: Problem[] } }) {
  return (
    <Link href={`/tracks/${track.id}/${track.problems[0]?.id}`}>
      <div className="flex gap-2 px-4 py-2 border-b hover:bg-slate-100 dark:hover:bg-slate-800">
        <img src={track.image} className="max-w-full w-12 object-cover aspect-square rounded" />
        <div className="w-[90%]">
          <div className="text-lg">{track.title}</div>
          <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{track.description}</p>
        </div>
      </div>
    </Link>
  );
}
