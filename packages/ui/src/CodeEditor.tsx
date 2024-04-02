import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";
import { useState } from "react";

export const CodeEditor = ({ editorRef }: any) => {
  const [language, setLanguage] = useState("javascript");

  function handleEditorChange(value: string | undefined, event: any) {
    console.log(value, "value");
    // here is the current value
  }

  function handleEditorDidMount(editor: any, monaco: any) {
    console.log("onMount: the editor instance:", editor);
    console.log("onMount: the monaco instance:", monaco);
    editorRef.current = editor;
    editor.focus();
  }

  function handleEditorWillMount(monaco: any) {
    console.log("beforeMount: the monaco instance:", monaco);
  }

  function handleEditorValidation(markers: any) {
    // model markers
    markers.forEach((marker: any) => console.log("onValidate:", marker.message));
  }

  return (
    <div className="bg-zinc-900">
      <LanguageSelector />
      <Editor
        height={`80vh`}
        defaultLanguage={language}
        defaultValue=""
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
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
