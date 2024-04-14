import prisma from "@repo/db/client";

export async function POST(req: Request) {
  const { userid, trackid } = await req.json();
  if (userid === null) {
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
    const bookmarkStatus = await prisma.bookmark.findFirst({
      where: {
        user: userid,
        track: trackid,
      },
    });
    if (bookmarkStatus === null) {
      return Response.json({
        success: false,
      });
    }
    return Response.json(
      {
        bookmarkStatus,
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
    });
  }
}
