import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import db from "@repo/db/client";
import { authOptions } from "../../../../lib/auth";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const user = await db.user.update({
    where: { email: session.user.email },
    data: { name }
  });

  return NextResponse.json(user);
}
