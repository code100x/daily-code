import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import db from "@repo/db/client";

export async function POST(req: NextRequest, { params }: { params: { trackId: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id;
    const { trackId } = params

    try {
        const track = await db.track.findUnique({
            where: { id: trackId }
        });

        const updatedProgress = await db.trackProgress.upsert({
            where: { userId_trackId: { userId: userId, trackId: trackId } },
            create: { userId, trackId: trackId, progress: true },
            update: { progress: true },
        })
        return NextResponse.json({ updatedProgress }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: `Failed to mark track as complete: ${error}` }, { status: 500 });
    }
}