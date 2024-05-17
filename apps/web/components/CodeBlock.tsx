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
        <div className={`${styles.copy_block} absolute top-0 right-0`}>
          <button
            className={styles.copy_button}
            onClick={() => {
              navigator.clipboard.writeText(code).then(() => {
                setShowCopiedMessage(true);
                setTimeout(() => {
                  setShowCopiedMessage(false);
                }, 1000);
              });
            }}
          >
            Copy
          </button>
          {showCopiedMessage && (
            <div className={styles.copied_text}>Copied!!</div>
          )}
        </div>
      </pre>
    </div>
  );
}
