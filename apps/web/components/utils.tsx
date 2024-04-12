import db from "@repo/db/client";

export async function getProblem(problemId: string | null) {
  if (!problemId) {
    return null;
  }
  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
      include: {
        problemStatement: true,
      },
    });
    return problem;
  } catch (err) {
    return null;
  }
}

export async function getTrack(trackId: string) {
  try {
    const track = await db.track.findUnique({
      where: {
        id: trackId,
      },
      include: {
        problems: {
          select: {
            problem: true,
          },
        },
      },
    });

    if (track) {
      return {
        ...track,
        problems: track.problems.map((problem) => ({ ...problem.problem })),
      };
    }

    return null;
  } catch (err) {
    return null;
  }
}

export async function getAllTracks() {
  try {
    const tracks = await db.track.findMany({
      where: {
        hidden: false,
      },
      include: {
        problems: {
          select: {
            problem: true,
          },
          orderBy: [
            {
              sortingOrder: "desc",
            },
          ],
        },
        category: {
          select: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return tracks.map((track) => ({
      ...track,
      problems: track.problems.map((problem) => ({ ...problem.problem })),
    }));
  } catch (e) {
    return [];
  }
}

export async function getAllCategories() {
  try {
    const categories = await db.categories.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    });
    return categories;
  } catch (e) {
    return [];
  }
}
