import { getFunction } from "@repo/common";
import { AppbarClient } from "../components/AppbarClient";
import { Categories, Tracks } from "@repo/ui/components";

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

  return (
    <div>
      <AppbarClient />
      <div className="flex justify-center pt-4">
        <div className="text-zinc-950 dark:text-zinc-50 text-4xl p-2 max-w-screen-md font-semibold mt-2 mb-4">
          Learning Paths
        </div>
      </div>
      <Categories />
      <Tracks tracks={tracks} />
    </div>
  );
}
