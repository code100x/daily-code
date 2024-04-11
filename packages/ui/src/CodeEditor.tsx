import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { Button } from "./shad/ui/button";
import { codeValueState, languageState } from "@repo/store";

const CODE_LANGUAGES = [
  {
    label: "Javascript",
    editorValue: "javascript",
    compilerLangId: 63,
    id: 1,
  },
  {
    label: "C++",
    editorValue: "cpp",
    compilerLangId: 54,
    id: 2,
  },
];

export const CodeEditor = () => {
  const language = useRecoilValue(languageState);
  const [codeValue, setCodeValue] = useRecoilState(codeValueState);

  const handleChange = (_value?: string) => {
    if (_value) {
      setCodeValue(_value);
    }
  };

  return (
    <div className="bg-zinc-900">
      <LanguageSelector />
      <Editor
        height={"80vh"}
        value={codeValue}
        theme="vs-dark"
        onMount={() => {}}
        options={{
          fontSize: 14,
        }}
        language={language}
        onChange={handleChange}
        defaultLanguage="javascript"
        className="overflow-scroll"
      />
    </div>
  );
};

function LanguageSelector() {
  const setLanuage = useSetRecoilState(languageState);
  return (
    <div className="p-2 flex">
      <Select
        onValueChange={(value) => {
          setLanuage(value);
        }}
        defaultValue="javascript"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {CODE_LANGUAGES.map(({ editorValue, label, id }) => (
            <SelectItem key={id} value={editorValue}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
