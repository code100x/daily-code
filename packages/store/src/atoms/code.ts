import { atom } from "recoil";

const DEFAULT_CODE = `const twoSum = (array, goal) => {
    let indexes = [];

    for(let i = 0; i < array.length; i++){
       for(let j = i + 1; j < array.length; j++){
          if (array[i] + array[j] === goal) {
        indexes.push(i);
        indexes.push(j);
          }
       }
    }
    return indexes;
}
`;

const TEST_CASES = [
  { id: 1, input: ["[2, 7, 11, 15]", "9"], output: "[ 0, 1 ]" }, // Original test case
  { id: 2, input: ["[3, 2, 4]", "6"], output: "[ 1, 2 ]" }, // Test case where the two numbers are adjacent
  { id: 3, input: ["[-1, -2, -3, -4, -5]", "-8"], output: "[ 2, 4 ]" }, // Test case with negative numbers
  // Add more test cases as needed
];

export const languageState = atom({
  key: "languageState",
  default: "javascript",
});

export const codeValueState = atom({
  key: "codeValueState",
  default: DEFAULT_CODE,
});

export const testCasesState = atom({
  key: "testCasesState",
  default: TEST_CASES,
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
