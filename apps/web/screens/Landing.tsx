import { AppbarClient } from "../components/AppbarClient";
import { getAllCategories, getAllTracks } from "../components/utils";
import { Categories } from "../components/Categories";
import { Tracks } from "../components/Tracks";
import Footer from "./footer";

export async function Landing() {
  const tracks = await getAllTracks();
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col h-screen justify-between">
      <div>
        <AppbarClient tracks={tracks} />
        <div className="flex justify-center pt-4">
          <div className="text-zinc-950 dark:text-zinc-50 text-4xl p-2 max-w-screen-md font-semibold mt-2 mb-4">
            Learning Paths
          </div>
        </div>
        <div>
          <Categories categories={categories} />
          <Tracks tracks={tracks} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
