import Editor from '@monaco-editor/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "./shad/ui/select";
import { useState } from 'react';

export const CodeEditor = () => {
    const [language, setLanguage] = useState("javascript");
    return <div className='bg-zinc-900'>
        <LanguageSelector onSelect={(language) => {
            setLanguage(language);
        }} />
        <Editor
            height={`80vh`}
            defaultLanguage={language}
            defaultValue="function () {}"
            theme="vs-dark"
            onMount={() => {
                
            }}
            options={{
                fontSize: 18
            }}
        />
    </div>
}

function LanguageSelector({onSelect}: {onSelect: (language: string) => void}) {
    return <div className='p-2 flex'>
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
}