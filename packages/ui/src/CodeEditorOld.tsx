import { useState } from "react";
import CodeEditorLib from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";

export const CodeEditor = () => {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);
  return (
    <CodeEditorLib
      value={code}
      language="js"
      data-color-mode="dark"
      placeholder="Please enter JS code."
      onChange={(evn) => setCode(evn.target.value)}
      padding={15}
      rehypePlugins={[
        [rehypePrism, { ignoreMissing: true }],
        [
          rehypeRewrite,
          {
            rewrite: (node, index, parent) => {
              if (node.properties?.className?.includes("code-line")) {
                if (index === 0 && node.properties?.className) {
                  node.properties.className.push("demo01");
                  // console.log("~~~", index, node.properties?.className);
                }
              }
              if (node.type === "text" && node.value === "return" && parent.children.length === 1) {
                parent.properties.className.push("demo123");
              }
            },
          },
        ],
      ]}
      style={{
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        minHeight: "70vw",
      }}
    />
  );
};
