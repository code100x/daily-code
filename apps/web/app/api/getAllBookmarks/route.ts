import prisma from "@repo/db/client";

export async function POST(req: Request) {
  const { userid} = await req.json();
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
    const bookmarkStatus = await prisma.bookmark.findMany({
      where: {
        user: userid,
      },
    });
    return Response.json(
      bookmarkStatus
    ,{
      status:200
    });
    
  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
    });
  }
}
