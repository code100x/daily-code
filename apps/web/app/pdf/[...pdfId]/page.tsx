import { RedirectToLastSolved } from "../../../components/RedirectToLastSolved";
import { NotionAPI } from "notion-client";
import { LessonView } from "@repo/ui/components";
import { redirect } from "next/navigation";
import { Print } from "../../../components/Print";
import db from "@repo/db/client";

const notion = new NotionAPI();

async function getProblem(problemId: string | null) {
  if (!problemId) {
    return null;
  }
  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });
    return problem;
  } catch (err) {
    return null;
  }
}

async function getTrack(trackId: string) {
  try {
    const track = await db.track.findUnique({
      where: {
        id: trackId,
      },
      include: {
        problems: {
          select: {
            problem: true,
          },
        },
      },
    });

    if (track) {
      return {
        ...track,
        problems: track.problems.map((problem) => ({ ...problem.problem })),
      };
    }

    return null;
  } catch (err) {
    return null;
  }
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
