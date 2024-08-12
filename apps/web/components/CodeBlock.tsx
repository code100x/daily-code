import React, { useEffect, useState } from "react";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import styles from "./CodeBlock.module.css";
import "highlight.js/styles/github-dark.css";

export default function CodeBlock({ block }: { block: any }) {
  const code: string = block.properties.title[0].toString();
  hljs.registerLanguage("javascript", javascript);

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  return (
    <div className="max-w-full overflow-auto">
      <pre className={`${styles.code_block} px-4 sm:px-6 md:px-8 relative`}>
        <code className="language-javascript">{code}</code>
        <div className={`${styles.copy_block} absolute top-2 right-2`}>
          <button
            className="text-white bg-gray-500 py-1 px-2 rounded-md"
            onClick={() => {
              navigator.clipboard.writeText(code).then(() => {
                setShowCopiedMessage(true);
                setTimeout(() => {
                  setShowCopiedMessage(false);
                }, 2000);
              });
            }}
          >
            {showCopiedMessage ? "Copied!" : "Copy"}
          </button>
        </div>
      </pre>
    </div>
  );
}
