import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../../packages/db/src/index";
import { authOptions } from "../../../lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trackId, problemId } = await req.json();
  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        trackId,
        problemId,
      },
    });
    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trackId, problemId } = await req.json();
  try {
    await prisma.bookmark.deleteMany({
      where: {
        userId: session.user.id,
        trackId,
        problemId,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get("trackId");
  const problemId = searchParams.get("problemId");

  if (!trackId || !problemId) {
    return NextResponse.json({ error: "Track ID and Problem ID are required" }, { status: 400 });
  }

  try {
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId: session.user.id,
        trackId: trackId,
        problemId: problemId,
      },
    });
    return NextResponse.json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return NextResponse.json({ error: "Failed to check bookmark status" }, { status: 500 });
  }
}
