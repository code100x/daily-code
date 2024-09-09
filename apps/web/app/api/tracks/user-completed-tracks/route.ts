import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";
import db from "@repo/db/client";


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return NextResponse.json({ completedTracks: [], message: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id;
    try {
        const completedTracks = await db.trackProgress.findMany({
            where: {
                userId: userId,
                progress: true,
            },
            select: {
                trackId: true,
            },
        })
        const completedTrackIds: string[] = completedTracks.map((track) => track.trackId);

        return NextResponse.json({ completedTrackIds }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user completed tracks:", error);
        return NextResponse.json({ error: `Failed to fetch user completed tracks: ${error}` }, { status: 500 });
    }
}