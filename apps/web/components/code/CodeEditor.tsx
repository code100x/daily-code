import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/shad/ui";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";

import { CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";
import { codeValueState, languageState } from "../../../../packages/store/src/atoms";
import { useEffect } from "react";

const getDefaultCode = (language: string, funcName: string, paramNames: string[]) => {
  switch (language) {
    case "javascript":
      return `const ${funcName} = (${paramNames.join(",")}) => {}`;
    default:
      return ``;
  }
};

export const CodeEditor = ({
  problemStatement: { languagesSupported, testCases, mainFuncName, argumentNames },
}: {
  problemStatement: ProblemStatement & {
    languagesSupported: CodeLanguage[];
    testCases: TestCase[];
  };
}) => {
  const language = useRecoilValue(languageState);
  const [codeValue, setCodeValue] = useRecoilState(codeValueState);

  const handleChange = (value?: string) => {
    if (value) setCodeValue((prev: any) => ({ ...prev, [language]: value }));
  };

  useEffect(() => {
    if (!codeValue) {
      let defaultCodeValue: any = {};
      languagesSupported.forEach((_language) => {
        defaultCodeValue[_language.value] = getDefaultCode(_language.value, mainFuncName, argumentNames);
      });

      setCodeValue(defaultCodeValue);
    }
  }, [languagesSupported, mainFuncName, argumentNames]);
  if (codeValue) {
    return (
      <div className="bg-zinc-900 h-full">
        <LanguageSelector languages={languagesSupported} />
        <Editor
          height={"80vh"}
          value={codeValue[language]}
          theme="vs-dark"
          onMount={() => {}}
          options={{
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
          language={language}
          onChange={handleChange}
          defaultLanguage="javascript"
        />
      </div>
    );
  }
};

function LanguageSelector({ languages }: { languages: CodeLanguage[] }) {
  const setLanguage = useSetRecoilState(languageState);
  return (
    <div className="p-2 flex">
      <Select
        onValueChange={(value) => {
          setLanguage(value);
        }}
        defaultValue="javascript"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map(({ id, value, label }) => (
            <SelectItem key={id} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
