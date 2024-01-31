import { Track } from "@repo/store";
import { getFunction } from "@repo/common";
import { TrackCard } from "@repo/ui/components";
import Link from "next/link";
import { AppbarClient } from "../components/AppbarClient";
import classes from "./Landing.module.css";

async function getTracks() {
  const getTrancksFn = getFunction("getTracks");
  try {
    const tracks: any = await getTrancksFn();
    console.log(tracks);
    return tracks.data.tracks || [];
  } catch (e) {
    return [];
  }
}

export async function Landing() {
  const tracks = await getTracks();

  return (
    <div>
      <AppbarClient />
      <div className="flex justify-center pt-4">
        <div className="text-white text-4xl p-2 max-w-screen-md">
          Learning Paths
        </div>
      </div>

      <div className={classes.grid_container}>
        {tracks.map((t: Track) => (
          <div className="flex justify-center pt-1">
            <Link className="max-w-screen-md w-full" href={`/tracks/${t.id}`}>
              <TrackCard track={t} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
