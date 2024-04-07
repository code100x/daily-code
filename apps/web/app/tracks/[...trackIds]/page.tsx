import { RedirectToLastSolved } from "../../../components/RedirectToLastSolved";
import { NotionAPI } from "notion-client";
import { LessonView } from "@repo/ui/components";
import { redirect } from "next/navigation";
import db from "@repo/db/client";

const notion = new NotionAPI();

export async function generateStaticParams() {
  try {
    const tracks = await db.track.findMany({
      where: {
        hidden: false,
      },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const params = tracks.map((track) =>
      track.problems.map((problem) => {
        if (problem.problem.type === "Blog") {
          return {
            trackIds: [track.id, problem.problemId],
          };
        }
      })
    );

    return params.flat();
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function getProblem(problemId: string | null) {
  console.log("getting prob: ", problemId);
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
      </div>
    );
  }
}

export const revalidate = 3600;
