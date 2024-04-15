import { atom, selector } from "recoil";
import { TestCase } from "@prisma/client";
export const languageState = atom({
  key: "languageState",
  default: "javascript",
});

export const codeValueState = atom<any>({
  key: "codeValueState",
  default: null,
});

export const testCasesState = atom<any[]>({
  key: "testCasesState",
  default: [],
});

export const codeRunLoadingState = atom({
  key: "codeRunLoadingState",
  default: false,
});
export const codeSubmitLoadingState = atom({
  key: "codeSubmitLoadingState",
  default: false,
});

export const testRunResultsState = atom<any[]>({
  key: "testRunResultsState",
  default: [],
});
export const testSubmitResultState = atom<any>({
  key: "testSubmitResultState",
  default: null,
});

export const activeTabState = atom({
  key: "activeTabState",
  default: "description",
});

export const fetchSubmissionsLoadingState = atom({
  key: "fetchSubmissionsLoadingState",
  default: false,
});
export const activeSubmissionIdState = atom<any>({
  key: "activeSubmissionIdState",
  default: null,
});
export const submissionResultState = atom<any>({
  key: "submissionResultState",
  default: null,
});

// Selector to get submission result based on active submission ID
export const activeSubmissionResultSelector = selector({
  key: "activeSubmissionResultSelector",
  get: ({ get }) => {
    const activeSubmissionId = get(activeSubmissionIdState);
    const submissionResult = get(submissionResultState);
    return activeSubmissionId && submissionResult ? submissionResult[activeSubmissionId] : null;
  },
});

export const adminTestCasesState = atom<Omit<TestCase, "id" | "problemStatementId">[]>({
  key: "adminTestCasesState",
  default: [],
});
