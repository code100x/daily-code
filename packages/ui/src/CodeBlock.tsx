import React, { useEffect, useState } from "react";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import styles from "../app/CodeBlock.module.css";
import "highlight.js/styles/github-dark.css";

export default function CodeBlock({ block }: { block: any }) {
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  const code: string = block.properties.title[0].toString();
  hljs.registerLanguage("javascript", javascript);
  console.log(block);
  const copied_display_id = `copied_display_${block.id}`;
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const copiedDisplayElement = document.getElementById(copied_display_id);

  return (
    <div className="max-w-full overflow-auto">
      <pre className={`${styles.code_block} px-4 sm:px-6 md:px-8 relative`} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>clicked?setHover(true) : setHover(false)}>
        <code className="language-javascript">{code}</code>
        <div className={`${styles.copy_block} absolute top-0 right-0`}>
          <button
            className={`${styles.copy_button} ${hover?"visible": "invisible"} flex justify-center items-center`}
            onClick={() => {
              setClicked(true)
              navigator.clipboard.writeText(code).then(() => {
                if (copiedDisplayElement) {
                  copiedDisplayElement.style.display = "block";
                  setTimeout(() => {
                    copiedDisplayElement.style.display = "none";
                    setClicked(false)
                    setHover(false)
                  }, 1000);
                }
              });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
            </svg>
          </button>
        </div>
        <div id={copied_display_id} className={`${styles.copied_text} absolute right-0 top-11`}>
              Copied!
        </div>
      </pre>
    </div>
  );
}
