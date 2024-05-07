"use server";
import db from "@repo/db/client";
import { ProblemStatement, TestCase, CodeLanguage,MCQQuestion } from "@prisma/client";
import { Prisma } from "@prisma/client";

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
        problemStatement: {
          include: {
            testCases: true,
            languagesSupported: true,
          },
        },
      },
    });
    return problem;
  } catch (err) {
    return null;
  }
}

export async function getFirstProblemForTrack(trackId: string) {
  try {
    const track = await db.track.findUnique({
      where: {
        id: trackId,
      },
      select: {
        problems: true,
      },
    });
    return track?.problems[0]?.problemId || null;
  } catch (err) {
    return null;
  }
}

export async function getAllProblems() {
  try {
    const problems = await db.problem.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        problemStatement: true,
      },
    });
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
    console.log(e);
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

export async function createProblemStatement({
  problemStatement,
  languages,
  testCases,
}: {
  problemStatement: Omit<ProblemStatement, "id">;
  languages: CodeLanguage[];
  testCases: Omit<TestCase, "id" | "problemStatementId">[];
}) {
  try {
    const createdProblemStatement = await db.problemStatement.create({
      data: {
        ...problemStatement,
        languagesSupported: {
          connect: languages.map(({ id }) => ({ id })),
        },
        testCases: {
          createMany: {
            data: testCases,
          },
        },
      },
    });
  } catch (e: any) {
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
        categories: {
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
    console.error(e);
    return [];
  }
}
export async function createTrack(data: {
  id: string;
  title: string;
  description: string;
  image: string;
  selectedCategory?: string[];
  problems: { problem: Prisma.ProblemCreateManyInput; sortingOrder: number }[];
  hidden: boolean;
}) {
  try {
    await db.problem.createMany({
      data: data.problems.map((x) => x.problem),
    });

    const track = await db.track.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        hidden: data.hidden,
        problems: {
          createMany: {
            data: data.problems.map((problem) => ({
              problemId: problem.problem.id!,
              sortingOrder: problem.sortingOrder!,
            })),
          },
        },
      },
    });

    if (data.selectedCategory) {
    data.selectedCategory.forEach(async (category) => {
      await db.trackCategory.create({
        data: {
          trackId: data.id,
          categoryId: category,
        },
      });
    });
    }
    return track;
  } catch (e) {
    console.log(e);
    return new Error("Failed to create track");
  }
}

export async function updateTrack(trackId: string, data: {
  id: string;
  title: string;
  description: string;
  image: string;
  selectedCategory?: string[];
  problems?: { problem: Prisma.ProblemCreateManyInput; sortingOrder: number }[];
  hidden: boolean;
}) {
  try {
    const track = await db.track.update({
      where: {
        id: trackId,
      },
      data:{
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        hidden: data.hidden,
      }
    });
    await db.trackCategory.deleteMany({
      where: {
        trackId: trackId,
      },
    })
    if (data.selectedCategory) {
      data.selectedCategory.forEach(async (category) => {
        await db.trackCategory.create({
          data: {
            trackId: trackId,
            categoryId: category,
          },
        });
      });
    }
    return track;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getAllCategories() {
  try {
    const categories = await db.categories.findMany({
      select: {
        id: true,
        category: true,
      },
      distinct: ["category"],
    });
    return categories;
  } catch (e) {
    return [];
  }
}

export async function getAllMCQs() {
  try {
    const mcqs = await db.problem.findMany({
      where: {
        type: "MCQ",
      },
      include: {
        mcqQuestions: true,
      },
    });
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function getAllMCQQuestion(problemId: string) {
  try {
    const mcqs = await db.mCQQuestion.findMany({
      where: {
        problemId,
      },
    });
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function createMCQ(data: any) {
  try {
    const mcq = await db.mCQQuestion.create({
      data,
    });
    return mcq;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function updateMCQ(id: string, data:MCQQuestion) {
  try {
    const mcq = await db.mCQQuestion.update({
      where: {
        id: id,
      },
      data,
    });
    return mcq;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function deleteMCQ(id: string) {
  try {
    const mcq = await db.mCQQuestion.delete({
      where: {
        id: id,
      },
    });
    return mcq;
  } catch (e) {
    return null;
  }
}

export async function getAllMCQsForProblem(problemId: string) {
  try {
    const mcqs = await db.mCQQuestion.findMany({
      where: {
        problemId,
      },
    });
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function createQuizScore(data: {
  userId: string;
  score: number;
  problemId: string;
}) {
  const submission = await db.quizScore.create({
    data,
  })
  return submission;
}

export async function getQuizScore({userId,problemId}: {userId: string, problemId: string}) {
  try {
    const submissions = await db.quizScore.findMany({
      where: {
        userId,
        problemId,
      }
    });
    return submissions;
  } catch (e) {
    return [];
  }
}