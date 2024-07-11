"use server";
import db from "@repo/db/client";
import { ProblemStatement, TestCase, CodeLanguage, MCQQuestion, Problem, TrackProblems } from "@prisma/client";
import { Prisma } from "@prisma/client";

const cache: { [key: string]: { data: any; timer: NodeJS.Timeout } } = {};

function setCache(key: string, data: any, duration: number) {
  if (cache[key]) {
    clearTimeout(cache[key].timer);
  }
  const timer = setTimeout(() => {
    delete cache[key];
  }, duration);
  cache[key] = { data, timer };
}

function getCache(key: string) {
  return cache[key]?.data;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export async function getProblem(problemId: string | null) {
  const cacheKey = `problem_${problemId}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

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
    setCache(cacheKey, problem, CACHE_DURATION);
    return problem;
  } catch (err) {
    return null;
  }
}

export async function getFirstProblemForTrack(trackId: string) {
  const cacheKey = `first_problem_for_track_${trackId}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
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
    const firstProblemId = track?.problems[0]?.problemId || null;
    setCache(cacheKey, firstProblemId, CACHE_DURATION);
    return firstProblemId;
  } catch (err) {
    return null;
  }
}

export async function getAllProblems() {
  const cacheKey = `all_problems`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
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
    setCache(cacheKey, problems, CACHE_DURATION);
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
    delete cache[`problem_${problemId}`];
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
  const cacheKey = `track_${trackId}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
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
      return {
        ...track,
        problems: track.problems.map((problem) => ({ ...problem.problem })),
      };
      setCache(cacheKey, trackWithProblems, CACHE_DURATION);
      return trackWithProblems;
    }

    return null;
  } catch (err) {
    return null;
  }
}

export async function getAllTracks() {
  const cacheKey = `all_tracks`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
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
    return tracks.map((track) => ({
      ...track,
      problems: track.problems.map((problem) => ({ ...problem.problem })),
    }));
    setCache(cacheKey, tracksWithProblems, CACHE_DURATION);
    return tracksWithProblems;
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
    delete cache['all_tracks'];
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
    delete cache[`track_${trackId}`];
    delete cache['all_tracks'];
    return track;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getAllCategories() {
  const cacheKey = `all_categories`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const categories = await db.categories.findMany({
      select: {
        id: true,
        category: true,
      },
      distinct: ["category"],
    });
    setCache(cacheKey, categories, CACHE_DURATION);
    return categories;
  } catch (e) {
    return [];
  }
}

export async function getAllMCQs() {
  const cacheKey = `all_mcqs`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
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
    setCache(cacheKey, mcqs, CACHE_DURATION);
    return mcqs;
  } catch (e) {
    return [];
  }
}

export async function getAllMCQQuestion(problemId: string) {
  const cacheKey = `mcq_questions_for_problem_${problemId}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const mcqs = await db.mCQQuestion.findMany({
      where: {
        problemId,
      },
    });
    setCache(cacheKey, mcqs, CACHE_DURATION);
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
    delete cache['all_mcqs'];
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
    delete cache['all_mcqs'];
    delete cache[`mcq_questions_for_problem_${data.problemId}`];
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
    delete cache['all_mcqs'];
    return mcq;
  } catch (e) {
    return null;
  }
}
export async function getAllMCQsForProblem(problemId: string) {
  const cacheKey = `mcqs_for_problem_${problemId}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const mcqs = await db.mCQQuestion.findMany({
      where: {
        problemId,
      },
    });
    setCache(cacheKey, mcqs, CACHE_DURATION);
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
  try {
    const submissions = await db.quizScore.findMany({
      where: {
        userId,
        problemId,
      },
    });
    return submissions;
  } catch (e) {
    return [];
  }
}
export async function getAllProblemStatements() {
  const cacheKey = `all_problem_statements`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
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
    setCache(cacheKey, problemStatements, CACHE_DURATION);
    return problemStatements;
  } catch (e) {
    return [];
  }
}

export async function getProblemStatement(statementId: string) {
  const cacheKey = `problem_statement_${statementId}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
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
    setCache(cacheKey, problemStatements, CACHE_DURATION);
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
    delete cache[`problem_statement_${problemStatementId}`];
    delete cache['all_problem_statements'];
    return problemStatement;
  } catch (e) {
    return null;
  }
}

export async function getAllTestCase(id: string) {
  const cacheKey = `test_case_${id}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
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
    setCache(cacheKey, testCase, CACHE_DURATION);
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
    delete cache[`test_cases_for_problem_statement_${problemStatementId}`];
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
    delete cache[`test_case_${testCaseId}`];
    return testCase;
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
    delete cache[`test_case_${testCaseId}`];
    return updatedTestCase;
  } catch (e) {
    return [];
  }
}

export async function getAllLanguagesSupported() {
  const cacheKey = `all_languages_supported`;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const languagesSupported: CodeLanguage[] = await db.codeLanguage.findMany({
      select: {
        id: true,
        label: true,
        value: true,
      },
    });
    setCache(cacheKey, languagesSupported, CACHE_DURATION);
    return languagesSupported;
  } catch (e) {
    return [];
  }
}
