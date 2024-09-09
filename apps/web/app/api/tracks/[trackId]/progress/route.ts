import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";
import { getServerSession } from "next-auth";
import db from "@repo/db/client";


export async function GET(req: NextRequest, { params }: { params: { trackId: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return NextResponse.json({ isCompleted: false }, { status: 200 });
    }
    const userId = session?.user?.id;
    const { trackId } = params

    try {
        const trackProgress = await db.trackProgress.findUnique({
            where: { userId_trackId: { userId, trackId } },
        })
        if (trackProgress) {
            return NextResponse.json({ progress: trackProgress.progress });
        } else {
            return NextResponse.json({ progress: false });
        }

    } catch (error) {
        return NextResponse.json({ error: `Failed to get track progress: ${error}` }, { status: 500 });
    }

}