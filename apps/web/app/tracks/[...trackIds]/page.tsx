import { RedirectToLastSolved } from "../../../components/RedirectToLastSolved";
import { NotionAPI } from "notion-client";
import { redirect, notFound } from "next/navigation";
import { getProblem, getTrack } from "../../../components/utils";
import { LessonView } from "../../../components/LessonView";
import { fetchNotionPage } from "../../../lib/notion";

const notion = new NotionAPI();
export const dynamic = "force-dynamic";

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
            url: track.image || "/default-thumbnail.jpg",
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
            url: "/default-thumbnail.jpg",
            alt: "Default Thumbnail",
          },
        ],
      },
    };
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
    notionRecordMap = await fetchNotionPage(notion, problemDetails.notionDocId);
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
