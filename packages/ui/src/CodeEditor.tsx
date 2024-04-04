import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";
import { MutableRefObject, useState } from "react";

interface CodeEditorProps {
  editorRef: MutableRefObject<any>;
}

export const CodeEditor = ({ editorRef }: CodeEditorProps) => {
  const [language, setLanguage] = useState("javascript");

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    editor.focus();
  }

  function handleEditorValidation(markers: any) {
    markers.forEach((marker: any) => console.log("onValidate:", marker.message));
  }

  return (
    <div className="bg-zinc-900">
      <LanguageSelector />
      <Editor
        height={`80vh`}
        defaultLanguage={language}
        defaultValue=""
        onMount={handleEditorDidMount}
        onValidate={handleEditorValidation}
        theme="vs-dark"
        options={{
          fontSize: 18,
        }}
      />
    </div>
  );
};

function LanguageSelector() {
  return (
    <div className="p-2 flex">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">C++</SelectItem>
          <SelectItem value="system">Rust</SelectItem>
          <SelectItem value="dark">Javascript</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
