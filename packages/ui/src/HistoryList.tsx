import { Track, Problem } from "@prisma/client";
import Link from "next/link";

export function HistoryList({ track, problemId }: { track: Track; problemId: string }) {
  return (
    <Link href={`/tracks/${track.id}/${problemId}`}>
      <div className="flex items-center gap-2 px-2 py-1 border-b hover:bg-slate-100 dark:hover:bg-slate-800">
        <img src={track.image} className="w-8 h-8 object-cover aspect-square rounded" />
        <div className="w-[90%] max-w-40 flex flex-col justify-center">
          <div className="text-md">{track.title}</div>
          <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{track.description}</p>
        </div>
      </div>
    </Link>
  );
}
