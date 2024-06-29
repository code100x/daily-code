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
  const [showAlert, setShowAlert] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div className="max-w-full overflow-auto">
      <pre className={`${styles.code_block} px-4 sm:px-6 md:px-8 relative`}>
        <code className="language-javascript">{code}</code>
        <div className={`${styles.copy_block} absolute top-0 right-0`}>
          <button
            className= {` px-1.5 py-0.5 border-none text-white ${
              isCopied ? "bg-neutral-600" : "bg-neutral-500"
            }`}
            onClick={() => {
              navigator.clipboard.writeText(code).then(() => {
                setShowCopiedMessage(true);
                setIsCopied(true);// User knows copy success as change in color triggered
                setShowAlert(true); // Show the custom alert
                setTimeout(() => {
                  setShowCopiedMessage(false);
                  setShowAlert(false); // Hide the custom alert
                  setIsCopied(false);
                }, 2000);
              });
            }}
          >
            Copy
          </button>
        </div>
      </pre>

      {showAlert && <CopiedAlert />} {/* Render custom alert */}
    </div>
  );
}



function CopiedAlert() {
  return (
    <div className={`${styles.copied_alert}`}>
      Code copied!
    </div>
  );
}ß