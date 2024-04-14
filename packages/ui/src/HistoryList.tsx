import Link from "next/link";

export function HistoryList({
  trackId,
  problemId,
  trackImg,
  trackTitle,
  trackDescription,
}: {
  trackId: string;
  problemId: string;
  trackImg: string;
  trackTitle: string;
  trackDescription: string;
}) {
  return (
    <Link href={`/tracks/${trackId}/${problemId}`}>
      <div className="flex items-center gap-2 px-2 py-1 border-b hover:bg-slate-100 dark:hover:bg-slate-800">
        <img src={trackImg} className="w-8 h-8 object-cover aspect-square rounded" />
        <div className="w-[90%] max-w-40 flex flex-col justify-center">
          <div className="text-md">{trackTitle}</div>
          <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{trackDescription}</p>
        </div>
      </div>
    </Link>
  );
}
