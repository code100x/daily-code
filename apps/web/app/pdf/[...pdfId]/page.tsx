import { RedirectToLastSolved } from "../../../components/RedirectToLastSolved";
import { NotionAPI } from "notion-client";
import { redirect } from "next/navigation";
import { Print } from "../../../components/Print";
import { getProblem, getTrack } from "../../../components/utils";
import { LessonView } from "../../../components/LessonView";

const notion = new NotionAPI();

export default async function TrackComponent({ params }: { params: { pdfId: string[] } }) {
  const trackId: string = params.pdfId[0] || "";
  const problemId = params.pdfId[1];
  let notionRecordMaps: any[] = [];
  if (trackId === "43XrfL4n0LgSnTkSB4rO") {
    redirect("/tracks/oAjvkeRNZThPMxZf4aX5");
  }
  const [problemDetails, trackDetails] = await Promise.all([getProblem(problemId || null), getTrack(trackId)]);

  if (!problemId) {
    return <RedirectToLastSolved trackId={trackId} />;
  }

  if (problemDetails?.notionDocId && trackDetails?.problems) {
    // notionRecordMaps = await notion.getPage(problemDetails.notionDocId);
    notionRecordMaps = await Promise.all(
      trackDetails.problems.map(async (problem) => await notion.getPage((await getProblem(problem.id))?.notionDocId!))
    );
  }
  if (trackDetails && problemDetails) {
    return (
      <div>
        {trackDetails?.problems.map((problem, i) => (
          <LessonView
            isPdfRequested={true}
            track={trackDetails}
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
}
