import { TrackCard } from "@repo/ui/components";
import Link from "next/link";
import { AppbarClient } from "../components/AppbarClient";
import { getAllCategories, getAllTracks } from "../components/utils";
import { Categories, Tracks } from "@repo/ui/components";

export async function Landing() {
  const tracks = await getAllTracks();
  const categories = await getAllCategories();

  return (
    <div>
      <AppbarClient tracks={tracks} />
      <div className="flex justify-center pt-4">
        <div className="flex flex-row text-zinc-950 dark:text-zinc-50 text-4xl p-2 max-w-screen-md font-semibold mt-2 mb-4 gap-x-4">
          <div className="mt-1">
            <Categories categories={categories} />
          </div>
          Learning Paths
        </div>
      </div>
      <div>
        <Tracks tracks={tracks} />
      </div>
    </div>
  );
}
