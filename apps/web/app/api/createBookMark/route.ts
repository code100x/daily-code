import prisma from "@repo/db/client";

export async function POST(req: Request) {
  const { userid, trackid } = await req.json();

  try {
    await prisma.bookmark.create({
      data: {
        user: userid,
        track: trackid,
      },
    });
    return Response.json(
      {
        success: true,
        data: "created",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
      },
      {
        status: 400,
      }
    );
  }
}
