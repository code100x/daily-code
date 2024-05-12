import { atom, selector } from "recoil";
import { TestCase, CodeLanguage, ProblemType } from "@prisma/client";
interface Problem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  notionDocId: string;
}

export const problemStatementId = atom<string>({
  key: "problemStatementId",
  default: "",
});

export const testCases = atom<Array<TestCase>>({
  key: "testCases",
  default: [],
});

export const problem = atom<Problem>({
  key: "problem",
  default: { id: "", title: "test", description: "", notionDocId: "", type: "Code" },
});

export const problemId = atom<string>({
  key: "problemId",
  default: "",
});

export const languagesSupported = atom<CodeLanguage[]>({
  key: "languagesSupported",
  default: [],
});

export const mainFuncName = atom<string>({
  key: "mainFuncName",
  default: "",
});

export const argumentNames = atom<string[]>({
  key: "argumentNames",
  default: [],
});

export const globalLanguagesSupported = atom<CodeLanguage[]>({
  key: "globalLanguagesSupported",
  default: [],
});

export const problemStatementsAtom = atom<any[]>({
  key: "problemStatements",
  default: [],
});
