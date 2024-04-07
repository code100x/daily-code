import { TrackCard } from "@repo/ui/components";
import Link from "next/link";
import { AppbarClient } from "../components/AppbarClient";
import { getAllTracks } from "../components/utils";

export async function Landing() {
  const tracks = await getAllTracks();

  return (
    <div>
      <AppbarClient tracks={tracks} />
      <div className="flex justify-center pt-4">
        <div className="text-zinc-950 dark:text-zinc-50 text-4xl p-2 max-w-screen-md font-semibold mt-2 mb-4">
          Learning Paths
        </div>
      </div>
      <div>
        <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2">
          {tracks.map((t) => (
            <li key={t.id}>
              {t.problems.length > 0 ? (
                <Link className="max-w-screen-md w-full" href={`/tracks/${t.id}/${t.problems[0]?.id}`}>
                  <TrackCard track={t} />
                </Link>
              ) : (
                <TrackCard track={t} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
