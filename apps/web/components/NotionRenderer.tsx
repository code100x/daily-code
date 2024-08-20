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
    <NotionRendererLib
      className={`pt-12 ${isDarkMode ? "!bg-[#0a0a0a]" : "bg-slate-50"}`}
      bodyClassName="text-base sm:text-lg"
      components={components}
      darkMode={isDarkMode}
      disableHeader
      fullPage
      recordMap={recordMap}
    />
  );
};
