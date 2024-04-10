// components/CodeRunner/CodeRunner.tsx
"use client";

import React, { useState } from "react";
import { runInNewContext } from "vm";

const CodeRunner: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const runCode = () => {
    try {
      const result = runInNewContext(code, {
        console: {
          log: (data: any) => {
            setOutput(String(data));
          },
        },
      });

      if (result !== undefined) {
        setOutput(String(result));
      }
      setError("");
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Code Runner</h2>
      <div className="mb-4">
        <label htmlFor="code" className="block font-medium mb-2">
          Code
        </label>
        <textarea
          id="code"
          value={code}
          onChange={handleCodeChange}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="language" className="block font-medium mb-2">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <button
        onClick={runCode}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
      >
        Run Code
      </button>
      {output && (
        <div className="mt-4 bg-gray-100 rounded-md p-4">
          <h3 className="text-lg font-medium mb-2">Output</h3>
          <pre className="text-gray-800">{output}</pre>
        </div>
      )}
      {error && <div className="mt-4 bg-red-100 rounded-md p-4 text-red-800">{error}</div>}
    </div>
  );
};

export default CodeRunner;
