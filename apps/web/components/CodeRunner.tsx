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

  const runCode = async () => {
    try {
      if (language === "javascript") {
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
      } else if (language === "cpp") {
        const cppOutput = await executeCode(code, "cpp");
        setOutput(cppOutput);
        setError("");
      } else {
        setOutput("");
        setError("Invalid language selected");
      }
    } catch (err) {
      console.error(err);
      setOutput("");
      if (language === "javascript" && !isValidJavaScript(code)) {
        setError("The code you entered is not valid for the selected language.");
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  const executeCode = async (code: string, lang: string): Promise<string> => {
    try {
      const response = await fetch("https://godbolt.org/api/compiler/gcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: code,
          options: {
            userArguments: lang === "cpp" ? ["-std=c++17"] : [],
          },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return data.asm || "No output";
      } else {
        return data.error || "An error occurred while executing code";
      }
    } catch (error) {
      console.error(`Error executing ${lang} code:`, error);
      return `An error occurred while executing ${lang} code`;
    }
  };

  const isValidJavaScript = (code: string): boolean => {
    try {
      runInNewContext(code, {});
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl text-black font-bold mb-4">Code Runner</h2>
      <div className="mb-4">
        <label htmlFor="code" className="block text-black font-medium mb-2">
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
