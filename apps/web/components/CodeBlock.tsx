"use client";

import React, { useEffect, useState } from "react";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import styles from "./CodeBlock.module.css";
import "highlight.js/styles/github-dark.css";
import { Button } from "@repo/ui";
import { CopyIcon } from "@radix-ui/react-icons";

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
          <Button
            variant={"ghost"}
            size={"sm"}
            className="rounded"
            onClick={() => {
              navigator.clipboard.writeText(code).then(() => {
                setShowCopiedMessage(true);
                setTimeout(() => {
                  setShowCopiedMessage(false);
                }, 1000 * 1.5);
              });
            }}
          >
            {showCopiedMessage ? <span>Copied!!</span> : <CopyIcon className="w-4 h-4" />}
          </Button>
        </div>
      </pre>
    </div>
  );
}
