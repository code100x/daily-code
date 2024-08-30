import { RedirectToLastSolved } from "../../../components/RedirectToLastSolved";
import { NotionAPI } from "notion-client";
import { redirect, notFound } from "next/navigation";
import { getAllTracks, getProblem, getTrack } from "../../../components/utils";
import { cache } from "react";
import { LessonView } from "../../../components/LessonView";

const notion = new NotionAPI();
export const dynamic = "auto";
// Dynamic Metadata
export async function generateMetadata({ params }: { params: { trackIds: string[] } }) {
  const trackId = params.trackIds[0] || "";
  const track = await getTrack(trackId);

  if (track) {
    return {
      title: track.title,
      description: track.description,
      openGraph: {
        title: track.title,
        description: track.description,
        images: [
          {
            url: track.image || "/default-thumbnail.jpg", // Fallback to a default image if thumbnail is not available
            alt: `${track.title} Thumbnail`,
          },
        ],
      },
    };
  } else {
    return {
      title: "Track Not Found",
      description: "The track you are looking for does not exist.",
      openGraph: {
        title: "Track Not Found",
        description: "The track you are looking for does not exist.",
        images: [
          {
            url: "/default-thumbnail.jpg", // Use a default image if the track is not found
            alt: "Default Thumbnail",
          },
        ],
      },
    };
  }
}

export async function generateStaticParams() {
  try {
    const tracks = await cache(getAllTracks)();
    const allPages = tracks.map((t: any) =>
      t.problems.map((p: any) => {
        if (p.type === "Blog") {
          return {
            trackIds: [t.id, p.id],
          };
        }
      })
    );

    return allPages.flat();
  } catch (e) {
    console.log(e);
    return [];
  }
}

export default async function TrackComponent({ params }: { params: { trackIds: string[] } }) {
  const trackId: string = params.trackIds[0] || "";
  const problemId = params.trackIds[1];
  let notionRecordMap = null;
  if (trackId === "43XrfL4n0LgSnTkSB4rO") {
    redirect("/tracks/oAjvkeRNZThPMxZf4aX5");
  }

  const [problemDetails, trackDetails] = await Promise.all([getProblem(problemId || null), getTrack(trackId)]);

  if (trackDetails && !problemId) {
    return <RedirectToLastSolved trackId={trackId} />;
  }

  if (problemDetails?.notionDocId) {
    notionRecordMap = await notion.getPage(problemDetails.notionDocId);
  }

  if (trackDetails && problemDetails) {
    return (
      <LessonView
        showAppBar
        showPagination
        track={trackDetails}
        problem={{
          ...problemDetails,
          notionRecordMap,
        }}
      />
    );
  } else {
    notFound();
  }
}
