import { CodeLanguage } from "@prisma/client";

const supportedLanguages: CodeLanguage[] = [
  {
    id: 50,
    value: "c",
    label: "C",
  },
  {
    id: 54,
    value: "cpp",
    label: "C++",
  },
  {
    id: 51,
    value: "c#",
    label: "C#",
  },
  {
    id: 90,
    value: "dart",
    label: "Dart",
  },
  {
    id: 95,
    value: "go",
    label: "Go",
  },
  {
    id: 62,
    value: "java",
    label: "Java",
  },
  {
    id: 63,
    value: "javascript",
    label: "JavaScript",
  },
  {
    id: 78,
    value: "kotlin",
    label: "Kotlin",
  },
  {
    id: 85,
    value: "perl",
    label: "Perl",
  },
  {
    id: 92,
    value: "python",
    label: "Python",
  },
  {
    id: 80,
    value: "r",
    label: "R",
  },
  {
    id: 72,
    value: "ruby",
    label: "Ruby",
  },
  {
    id: 73,
    value: "rust",
    label: "Rust",
  },
  {
    id: 83,
    value: "swift",
    label: "Swift",
  },
  {
    id: 94,
    value: "typeScript",
    label: "TypeScript",
  },
];

export default supportedLanguages;
