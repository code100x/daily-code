import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";
import { Dispatch, MutableRefObject, ReactEventHandler, SetStateAction, SyntheticEvent, useState } from "react";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "@repo/common";

interface CodeEditorProps {
  editorRef: MutableRefObject<any>;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}

export const CodeEditor = ({ editorRef, setLanguage, language }: CodeEditorProps) => {
  const [value, setValue] = useState<string | undefined>();

  const onSelect = (language: any) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    editor.focus();
  }

  return (
    <div className="bg-zinc-900">
      <LanguageSelector language={language} onSelect={onSelect} />
      <Editor
        height={`80vh`}
        defaultLanguage={language}
        defaultValue={CODE_SNIPPETS[language]}
        onMount={handleEditorDidMount}
        value={value}
        onChange={(value) => setValue(value)}
        theme="vs-dark"
        options={{
          fontSize: 18,
        }}
      />
    </div>
  );
};

interface LanguageSelectorProps {
  onSelect: (value: string) => void;
  language: string;
}

function LanguageSelector({ language, onSelect }: LanguageSelectorProps) {
  const languages = Object.entries(LANGUAGE_VERSIONS);
  return (
    <div className="p-2 flex">
      <Select onValueChange={(value) => onSelect(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={language} />
        </SelectTrigger>
        <SelectContent>
          {languages.map(([lang, version]) => (
            <SelectItem value={lang} key={lang}>
              {lang} &nbsp;
              <span className="text-sm">({version})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
