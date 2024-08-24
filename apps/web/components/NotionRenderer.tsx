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
          :root {
            --bg-color: #FAFAFA;
            --fg-color: #0a0a0a;
          }
          .dark-mode {
            --bg-color: #0a0a0a;
            --fg-color: #FAFAFA;
          }
          .notion-header {
            display: none !important;
          }          
          .notion-code {
          border-radius: 12px;
          }

          .medium-zoom-image {
            border-radius: 0.5rem;
            border: 1px solid #0a0a0a36;
            background-size: cover;
            cursor: pointer;
          }
          .notion-page: {
            padding: 0px !important;
            background-color: transparent !important;
            
          }
        `}
      </style>
      <div>
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
