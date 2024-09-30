import { AppbarClient } from "../components/AppbarClient";
import { getAllCategories } from "../components/utils";
import { getAllTracks } from "../components/utils";
import Footer from "./footer";
import Hero from "../components/Hero";
import { Tracks } from "../components/Tracks";
import FooterCTA from "./footer-cta";

export async function Landing() {
  const tracks = await getAllTracks();
  const categories = await getAllCategories(); // Fetch categories

  return (
    <div className="flex flex-col">
      <AppbarClient />
      <Hero tracks={tracks} />
      <Tracks tracks={tracks} categories={categories} />
      <FooterCTA />
      <Footer />
    </div>
  );
}
