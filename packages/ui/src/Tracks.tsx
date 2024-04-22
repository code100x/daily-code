import { Problem, Track } from "@prisma/client";
import { TrackCard } from "@repo/ui/components";
import Link from "next/link";

interface Tracks extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export const Tracks = ({ tracks }: { tracks: Tracks[] }) => {
  return (
    <div>
      <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 place-items-center lg:grid-cols-2 w-full">
        {tracks.map((t) => (
          <li key={t.id} className="max-w-screen-md w-full">
            {t.problems.length > 0 ? (
              <Link className="w-full" href={`/tracks/${t.id}/${t.problems[0]?.id}`}>
                <TrackCard track={t} />
              </Link>
            ) : (
              <TrackCard track={t} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
