import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json([], { status: 200 });
  }

  const userId = session.user.id;

  if (userId === null || session === null) {
    return Response.json(
      {
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const bookmarkStatus = await prisma.bookmark.findMany({
      where: {
        user: userId,
      },
    });
    return Response.json(
      bookmarkStatus
      , {
        status: 200
      });

  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
    });
  }
}
