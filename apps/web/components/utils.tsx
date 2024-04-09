"use server";
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
    });
    return problem;
  } catch (err) {
    return null;
  }
}

export async function getAllProblems() {
  try {
    const problems = await db.problem.findMany();
    return problems;
  } catch (e) {
    return [];
  }
}

export async function updateProblem(problemId: string, data: any) {
  try {
    const problem = await db.problem.update({
      where: {
        id: problemId,
      },
      data,
    });
    return problem;
  } catch (e) {
    return null;
  }
}

export async function createProblem(data: any) {
  try {
    const problem = await db.problem.create({
      data,
    });
    return problem;
  } catch (e) {
    return null;
  }
}

export async function createTrackProblems(data: any) {
  try {
    const trackProblems = await db.trackProblems.create({
      data: {
        trackId: data.trackId,
        problemId: data.problemId,
        sortingOrder: data.sortingOrder,
      },
    });
    return trackProblems;
  } catch (e) {
    console.error(e);
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
            problemId: true,
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
export async function createTrack(data: any) {
  try {
    const track = await db.track.create({
      data,
    });
    return track;
  } catch (e) {
    return null;
  }
}

export async function updateTrack(trackId: string, data: any) {
  try {
    const track = await db.track.update({
      where: {
        id: trackId,
      },
      data,
    });
    return track;
  } catch (e) {
    return null;
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
