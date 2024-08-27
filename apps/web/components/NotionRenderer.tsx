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
      bodyClassName="pt-12 text-base sm:text-lg"
      className="py-10 dark:!bg-[#0a0a0a]"
      components={components}
      darkMode={isDarkMode}
      disableHeader
      fullPage
      recordMap={recordMap}
    />
  );
};
