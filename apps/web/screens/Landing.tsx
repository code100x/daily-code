import { Track } from "@repo/store";
import { getFunction } from "@repo/common";
import { TrackCard } from "@repo/ui/components";
import Link from "next/link";
import { AppbarClient } from "../components/AppbarClient";
import { useTheme } from "../components/ThemeContext"; 

async function getTracks() {
  const getTracksFn = getFunction("getTracks");
  try {
    const tracks: any = await getTracksFn();
    console.log(tracks);
    return tracks.data.tracks || [];
  } catch (e) {
    return [];
  }
}

export async function Landing() {
  const tracks = await getTracks();
  const { theme } = useTheme(); // Use the useTheme hook to get the current theme

  return (
    <div style={{ background: theme.background, color: theme.text }}>
      <AppbarClient />
      <div className="flex justify-center pt-4">
        <div className="text-zinc-950 dark:text-zinc-50 text-4xl p-2 max-w-screen-md font-semibold mt-2 mb-4">
          Learning Paths
        </div>
      </div>
      <div>
        <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2">
          {tracks.map((t: Track) => (
            <li key={t.id}>
              <Link className="max-w-screen-md w-full" href={`/tracks/${t.id}`}>
                <TrackCard track={t} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

