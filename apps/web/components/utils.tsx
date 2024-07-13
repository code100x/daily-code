"use server";
import db from "@repo/db/client";
import { ProblemStatement, TestCase, CodeLanguage, MCQQuestion, Problem, TrackProblems } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { cache } from '../../../packages/db/Cache';

export async function getProblem(problemId: string | null) {
  if (!problemId) {
    return null;
  }
  const value = await cache.get('problems', [problemId.toString()]);
  if(value) {
    return value;
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
    if(problem) {
      await cache.set('problems', [problemId.toString()], problem);
    }
    return problem;
  } catch (err) {
    return null;
  }
}

export async function getFirstProblemForTrack(trackId: string) {
  const value = await cache.get("tracks", [trackId.toString()]);
  if(value) {
    console.log("successfully added");
    return value;
  }

  try {
    const track = await db.track.findUnique({
      where: {
        id: trackId,
      },
      select: {
        problems: true,
      },
    });
    await cache.set('tracks', [trackId.toString()], track);
    return track?.problems[0]?.problemId || null;
  } catch (err) {
    return null;
  }
}

export async function getAllProblems() {
  const value = await cache.get('getAllProblems', []);
  if(value) {
    return value;
  }
  try {
    const problems = await db.problem.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        problemStatement: true,
      },
    });
    await cache.set('getAllProblems', [], problems);
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
  const value = await cache.get('Track', [trackId.toString()]);
  if(value) {
    return value;
  }
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
      await cache.set('Track', [trackId.toString()], track);
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
  const value = await cache.get('getAllTracks', []);
  if(value) {
    console.log("get successfully");
    return value;
  }
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
    console.log(tracks);
    await cache.set('getAllTracks', [], tracks);
    console.log("hello set successfully");
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

export async function updateTrack(
  trackId: string,
  data: {
    id: string;
    title: string;
    description: string;
    image: string;
    selectedCategory?: string[];
    problems?: { problem: Prisma.ProblemCreateManyInput; sortingOrder: number }[];
    hidden: boolean;
  }
) {
  try {
    const track = await db.track.update({
      where: {
        id: trackId,
      },
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        hidden: data.hidden,
      },
    });
    await db.trackCategory.deleteMany({
      where: {
        trackId: trackId,
      },
    });
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
  const value = await cache.get('getAllCategories', []);
  if(value) {
    return value;
  } 
  try {
    const categories = await db.categories.findMany({
      select: {
        id: true,
        category: true,
      },
      distinct: ["category"],
    });
    await cache.set('getAllCategories', [], categories);
    return categories;
  } catch (e) {
    return [];
  }
}

export async function getAllMCQs() {
  const value = await cache.get('getAllMCQs', []);
  if(value) {
    return value;
  }
  try {
    const mcqs = await db.problem.findMany({
      where: {
        type: "MCQ",
      },
      include: {
        mcqQuestions: true,
      },
    });
    await cache.set('getAllMCQs', [], mcqs);
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function getAllMCQQuestion(problemId: string) {
  const value = await cache.get('getAllMCQQuestion', [problemId.toString()]);
  if(value) {
    return value;
  }
  try {
    const mcqs = await db.mCQQuestion.findMany({
      where: {
        problemId,
      },
    });
    await cache.set('getAllMCQQuestion', [problemId.toString()], mcqs);
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function createMCQ(data: Omit<MCQQuestion, "id">) {
  try {
    const mcq = await db.mCQQuestion.create({
      data,
    });
    return mcq;
  } catch (e) {
    return null;
  }
}

export async function updateMCQ(id: string, data: MCQQuestion) {
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
  const value = await cache.get('getAllMCQsForProblem', [problemId.toString()]);
  if(value) {
    return value;
  }
  try {
    const mcqs = await db.mCQQuestion.findMany({
      where: {
        problemId,
      },
    });
    await cache.set('getAllMCQsForProblem', [problemId.toString()], mcqs);
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function createQuizScore(data: { userId: string; score: number; problemId: string }) {
  const submission = await db.quizScore.create({
    data,
  });
  return submission;
}

export async function getQuizScore({ userId, problemId }: { userId: string; problemId: string }) {
  const value = await cache.get('getQuizScore', [userId.toString(), problemId.toString()]);
  if(value) {
    return value;
  }
  try {
    const submissions = await db.quizScore.findMany({
      where: {
        userId,
        problemId,
      },
    });
    await cache.set('getQuizScore', [userId.toString(), problemId.toString()], submissions);
    return submissions;
  } catch (e) {
    return [];
  }
}
export async function getAllProblemStatements() {
  const value = await cache.get('getAllProblemStatements', []);
  if(value) {
    return value;
  }
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
    await cache.set('getAllProblemStatements', [], problemStatements);
    return problemStatements;
  } catch (e) {
    return [];
  }
}

export async function getProblemStatement(statementId: string) {
  const value = await cache.get('getProblemStatement', [statementId.toString()]);
  if(value) {
    return value;
  }
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
    cache.set('getProblemStatement', [statementId.toString()], problemStatements);
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
  const value = await cache.get('getAllTestCase', [id.toString()]);
  if(value) {
    return value;
  }
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
    await cache.set('getAllTestCase', [id.toString()], testCase);
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
  const value = await cache.get('getAllLanguagesSupported', []);
  try {
    const languagesSupported: CodeLanguage[] = await db.codeLanguage.findMany({
      select: {
        id: true,
        label: true,
        value: true,
      },
    });
    await cache.set('getAllLanguagesSupported', [], languagesSupported);
    return languagesSupported;
  } catch (e) {
    return [];
  }
}
