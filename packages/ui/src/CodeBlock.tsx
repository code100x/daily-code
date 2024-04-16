import React, { useEffect } from "react";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import styles from "../app/CodeBlock.module.css";
import "highlight.js/styles/github-dark.css";

export default function CodeBlock({ block }: { block: any }) {
  var code: string = "";
  if (block.properties?.title) {
    code = block.properties.title[0].toString();
  }
  hljs.registerLanguage("javascript", javascript);
  console.log(block);
  const copied_display_id = `copied_display_${block.id}`;
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div>
      <pre className={styles.code_block}>
        <code className="language-javascript">{code}</code>
        <div className={styles.copy_block}>
          <button
            className={styles.copy_button}
            onClick={() => {
              navigator.clipboard.writeText(code).then(() => {
                // @ts-ignore
                document.getElementById(copied_display_id).style.display = "block";
                setTimeout(() => {
                  // @ts-ignore
                  document.getElementById(copied_display_id).style.display = "none";
                }, 1000);
              });
            }}
          >
            Copy
          </button>
          <div id={copied_display_id} className={styles.copied_text}>
            Copied!!
          </div>
        </div>
      </pre>
    </div>
  );
}
