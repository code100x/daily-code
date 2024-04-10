import { RedirectToLastSolved } from "../../../components/RedirectToLastSolved";
import { NotionAPI } from "notion-client";
import { LessonView } from "@repo/ui/components";
import { redirect } from "next/navigation";
import { getAllTracks, getProblem, getTrack } from "../../../components/utils";
import { cache } from "react";
import CodeRunner from "../../../components/CodeRunner";

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
  // @ts-ignore
  const trackId: string = params.trackIds[0];
  const problemId = params.trackIds[1];
  let notionRecordMap = null;
  if (trackId === "43XrfL4n0LgSnTkSB4rO") {
    redirect("/tracks/oAjvkeRNZThPMxZf4aX5");
  }

  //@ts-ignore
  const [problemDetails, trackDetails] = await Promise.all([getProblem(problemId || null), getTrack(trackId)]);

  if (!problemId) {
    return <RedirectToLastSolved trackId={trackId} />;
  }

  if (problemDetails?.notionDocId) {
    notionRecordMap = await notion.getPage(problemDetails.notionDocId);
  }

  if (trackDetails && problemDetails) {
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
        <CodeRunner />
      </div>
    );
  }
}
