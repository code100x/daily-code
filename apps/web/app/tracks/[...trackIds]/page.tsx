import { RedirectToLastSolved } from "../../../components/RedirectToLastSolved";
import { NotionAPI } from "notion-client";
import { redirect, notFound } from "next/navigation";
import { getAllTracks, getProblem, getTrack, updateTrackHistory } from "../../../components/utils";
import { cache } from "react";
import { LessonView } from "../../../components/LessonView";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

const notion = new NotionAPI();
export const dynamic = "auto";

export async function generateStaticParams() {
  try {
    const tracks = await cache(getAllTracks)();
    const allPages = tracks.map((t) =>
      t.problems.map((p) => {
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
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (user) {
      const lastSlide = trackDetails.problems[trackDetails.problems.length - 1];
      const isCompleted = lastSlide?.id === problemDetails.id;
      updateTrackHistory(user.id, trackDetails.id, problemDetails.id, isCompleted || undefined);
    }
    return (
      <div>
        <LessonView
          showAppBar
          track={trackDetails}
          problem={{
            ...problemDetails,
            notionRecordMap,
          }}
        />
      </div>
    );
  } else {
    notFound();
  }
}
