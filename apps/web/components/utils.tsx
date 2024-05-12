"use server";
import db from "@repo/db/client";
import { ProblemStatement, 
  TestCase, 
  CodeLanguage,
  MCQQuestion,
  Problem,
  TrackProblems,
 } from "@prisma/client";
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

export async function updateProblem(problemId: string, data: Problem) {
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

export async function createProblem(data: Omit<Problem, "id">) {
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
      include: {
        testCases: true,
        languagesSupported: true,
      },
    });
    return createdProblemStatement;
  } catch (e: any) {
    return null;
  }
}

export async function createTrackProblems(data: TrackProblems) {
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

export async function createMCQ(data: Omit<MCQQuestion,"id">) {
  try {
    const mcq = await db.mCQQuestion.create({
      data,
    });
    return mcq;
  } catch (e) {
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
export async function getAllProblemStatements() {
  try {
    const problemStatements = await db.problemStatement.findMany({
      select: {
        id: true,
        testCases: true,
        problem: true,
        problemId: true,
        languagesSupported: true,
        mainFuncName: true,
        argumentNames: true,
      },
    });
    return problemStatements;
  } catch (e) {
    return [];
  }
}

export async function getProblemStatement(statementId: string) {
  try {
    const problemStatements = await db.problemStatement.findMany({
      where: {
        id: statementId,
      },
      select: {
        id: true,
        testCases: true,
        problem: true,
        problemId: true,
        languagesSupported: true,
        mainFuncName: true,
        argumentNames: true,
      },
    });
    return problemStatements;
  } catch (e) {
    return null;
  }
}

export async function updateProblemStatement(problemStatementId: string, data: any) {
  try {
    const problemStatement = await db.problemStatement.update({
      where: {
        id: problemStatementId,
      },
      data: data,
    });
    return problemStatement;
  } catch (e) {
    return null;
  }
}

export async function getAllTestCase(id: string) {
  try {
    const testCase = await db.testCase.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        expectedOutput: true,
        problemStatement: true,
        problemStatementId: true,
        inputs: true,
      },
    });
    return testCase;
  } catch (e) {
    return null;
  }
}

export async function createTestCase(inputs: string[], expectedOutput: string, problemStatementId: string) {
  try {
    const testCase = await db.testCase.create({
      data: {
        inputs,
        expectedOutput,
        problemStatementId,
      },
    });
    return testCase;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function deleteTestCase(testCaseId: string) {
  try {
    await db.testCase.delete({
      where: {
        id: testCaseId,
      },
    });
  } catch (e) {
    return null;
  }
}

export async function updateTestCase(
  testCaseId: string,
  expectedOutput: string,
  problemStatementId: string,
  inputs: string[]
) {
  try {
    const updatedTestCase = await db.testCase.update({
      where: {
        id: testCaseId,
      },
      data: {
        expectedOutput,
        problemStatementId,
        inputs,
      },
    });
    return updatedTestCase;
  } catch (e) {
    return [];
  }
}

export async function getAllLanguagesSupported() {
  try {
    const languagesSupported: CodeLanguage[] = await db.codeLanguage.findMany({
      select: {
        id: true,
        label: true,
        value: true,
      },
    });
    return languagesSupported;
  } catch (e) {
    return [];
  }
}