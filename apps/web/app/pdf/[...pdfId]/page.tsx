import { getFunction } from "@repo/common";
import { Problem, Track } from "@repo/store";
import { RedirectToLastSolved } from "../../../components/RedirectToLastSolved";
import { NotionAPI } from "notion-client";
import { LessonView } from "@repo/ui/components";
import { redirect } from "next/navigation";
import { Print } from "../../../components/Print";

const notion = new NotionAPI();

async function getProblem(problemId: string | null): Promise<Problem | null> {
  if (!problemId) {
    return null;
  }
  const getProblem = getFunction("getProblem");
  const response: any = await getProblem({ problemId });
  return response.data.problem;
}

async function getTrack(trackId: string): Promise<{
  track: Track;
  userProgress: null | {
    nextProblemId: string;
    lastProblemId: string | null;
  };
}> {
  const getTrack = getFunction("getTrack");
  const response: any = await getTrack({ trackId });
  return response.data;
}

export default async function TrackComponent({ params }: { params: { pdfId: string[] } }) {
  // @ts-ignore
  const trackId: string = params.pdfId[0];
  const problemId = params.pdfId[1];
  let notionRecordMaps: any[] = [];
  if (trackId === "43XrfL4n0LgSnTkSB4rO") {
    redirect("/tracks/oAjvkeRNZThPMxZf4aX5");
  }

  //@ts-ignore
  const [problemDetails, trackDetails]: [Problem, { track: Track }] = await Promise.all([
    getProblem(problemId || null),
    getTrack(trackId),
  ]);

  if (!problemId) {
    return <RedirectToLastSolved trackId={trackId} />;
  }

  if (problemDetails?.notionDocId && trackDetails.track.problems) {
    // notionRecordMaps = await notion.getPage(problemDetails.notionDocId);
    notionRecordMaps = await Promise.all(
      trackDetails.track.problems.map(
        async (problemId) => await notion.getPage((await getProblem(problemId))?.notionDocId!)
      )
    );
  }

  return (
    <div>
      {trackDetails.track.problems.map((problem, i) => (
        <LessonView
          isPdfRequested = {true}
          track={trackDetails.track}
          problem={{
            ...problemDetails,
            notionRecordMap: notionRecordMaps[i],
          }}
          key={i}
        />
      ))}
      <Print />
    </div>
  );
}
