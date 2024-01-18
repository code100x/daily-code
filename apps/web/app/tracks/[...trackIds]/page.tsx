import { getFunction } from "@repo/common";
import { Problem } from "@repo/store";
import { RedirectToLastSolved } from "../../../components/RedirectToLastSolved";
import { NotionAPI } from 'notion-client'
import { LessonView } from "@repo/ui/components";

const notion = new NotionAPI()

async function getProblem(problemId: string): Promise<Problem> {
    const getProblem = getFunction("getProblem");
    const response: any = await getProblem({problemId});
    return response.data.problem;
}

export default async function Track({ params }: { params: { trackIds: string[] } }) {
    // @ts-ignore
    const trackId: string = params.trackIds[0];
    const problemId = params.trackIds[1];
    let notionRecordMap = null;

    if (!problemId) {
        return <RedirectToLastSolved trackId={trackId} />
    }
    const problemDetails = await getProblem(problemId);
    if (problemDetails.notionDocId) {
        notionRecordMap = await notion.getPage(problemDetails.notionDocId);
    }

    return <div>
        <LessonView problem={{
            ...problemDetails,
            notionRecordMap
        }} />
    </div>
}