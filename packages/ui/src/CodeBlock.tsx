import { useTheme } from "next-themes";
import CodeContent from "./CodeContent";
import { useEffect } from "react";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

export default function CodeBlock({ block }: { block: any }) {
  const code: string = block.properties.title[0].toString();
  const copied_display_id = `copied_display_${block.id}`;
  hljs.registerLanguage("javascript", javascript);
  const {resolvedTheme} = useTheme();
  useEffect(() => {
    hljs.highlightAll();
  }, []);
  
  useEffect(() => {
    // Dynamically load CSS based on theme, conditionally importing CSS
    const loadCSS = async () => {
      if (resolvedTheme === "dark") {
        await import("highlight.js/styles/vs2015.css");
      } else {
        await import("highlight.js/styles/vs.css");
      }
    };

    loadCSS();
  }, [resolvedTheme]);

  return(
      <>
        <CodeContent theme={resolvedTheme} code={code} codeId={copied_display_id} />
      </>
    )

}
