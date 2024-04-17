import { atom, selector } from "recoil";

export const problemStatementId = atom<any>({
  key: "problemStatementId",
  default: null,
});

export const testCases = atom<any>({
  key: "testCases",
  default: null,
});

export const problem = atom<any>({
  key: "problem",
  default: null,
});

export const problemId = atom<any>({
  key: "problemId",
  default: null,
});

export const languagesSupported = atom<any[]>({
  key: "languagesSupported",
  default: [],
});

export const mainFuncName = atom<any>({
  key: "mainFuncName",
  default: null,
});

export const argumentNames = atom<any[]>({
  key: "argumentNames",
  default: [],
});

export const globalLanguagesSupported = atom<any[]>({
  key: "globalLanguagesSupported",
  default: [],
});

export const problemStatementsAtom = atom<any[]>({
  key: "problemStatements",
  default: [],
});
