"use client";
import { NotionRenderer as NotionRendererLib } from "react-notion-x";
// import { Code } from "react-notion-x/build/third-party/code";
import CodeBlock from "./CodeBlock";
import { useTheme } from "next-themes";

// Week-4-1-647987d9b1894c54ba5c822978377910
export const NotionRenderer = ({ recordMap }: { recordMap: any }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="w-full">
      <style>
        {`
          .notion-header {
            display: none !important;
          }

          .notion-page: {
            padding: 0px !important;
          }
        `}
      </style>
      <div className="rounded-full">
        <NotionRendererLib
          components={{
            Code: CodeBlock,
          }}
          recordMap={recordMap}
          fullPage={true}
          darkMode={resolvedTheme === "dark"}
        />
      </div>
    </div>
  );
};
