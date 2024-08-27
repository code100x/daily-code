"use client";
import { useMemo } from "react";
import { NotionRenderer as NotionRendererLib } from "react-notion-x";
import { useTheme } from "next-themes";

import CodeBlock from "./CodeBlock";

// Week-4-1-647987d9b1894c54ba5c822978377910
export const NotionRenderer = ({ recordMap }: { recordMap: any }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const components = useMemo(
    () => ({
      Code: CodeBlock,
      // can add more components that are supported here
    }),
    []
  );

  return (
    <div className=".notion_ w-full .notion-bg-black mt-10">
      <style>
        {`
          :root {
            --notion-font-family: "Poppins", sans-serif; !important;
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
        bodyClassName="text-base sm:text-lg"
        className="pt-12 dark:!bg-[#0a0a0a]"
        components={components}
        darkMode={isDarkMode}
        disableHeader
        fullPage
        recordMap={recordMap}
      />
      </div>
    </div>
  );
};
