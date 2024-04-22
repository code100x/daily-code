import { Categories, Tracks } from "@repo/ui/components";
import { AppbarClient } from "../components/AppbarClient";
import { getAllCategories, getAllTracks } from "../components/utils";
import Footer from "../screens/footer";

export default async function Landing({ searchParams }: { searchParams: { category: string } }) {
  const tracks = await getAllTracks({ category: searchParams.category });
  const categories = await getAllCategories();

  return (
    <main>
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
      <Footer />
    </main>
  );
}
