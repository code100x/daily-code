import { getFunction } from "@repo/common";
import { Problem, Track } from "@repo/store";
import { NotionAPI } from "notion-client";
import { LessonView } from "@repo/ui/components";
import { redirect } from "next/navigation";

const notion = new NotionAPI();

async function getProblem(problemId: string): Promise<Problem> {
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

export default async function TrackComponent({ params }: { params: { trackIds: string[] } }) {
  const trackId: string = params.trackIds[0]!;
  const problemId: string = params.trackIds[1]!;
  let notionRecordMap = null;
  if (trackId === "43XrfL4n0LgSnTkSB4rO") {
    redirect("/tracks/oAjvkeRNZThPMxZf4aX5");
  }

  const [problemDetails, { track }]: [Problem, { track: Track }] = await Promise.all([
    getProblem(problemId),
    getTrack(trackId),
  ]);

  const allProblemTitles = await Promise.all(
    track.problems.map(async (problemId) => {
      const problem = await getProblem(problemId);
      return { id: problemId, title: problem?.title || "" };
    })
  );

  if (problemDetails?.notionDocId) {
    notionRecordMap = await notion.getPage(problemDetails.notionDocId);
  }

  return (
    <div>
      <LessonView
        showAppBar
        allProblems={allProblemTitles}
        track={track}
        problem={{
          ...problemDetails,
          notionRecordMap,
        }}
      />
    </div>
  );
}
