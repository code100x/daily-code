"use client";
import { useEffect, useMemo } from "react";
import { NotionComponents, NotionRenderer as NotionRendererLib } from "react-notion-x";
import { useTheme } from "next-themes";
import { useRecoilValue } from "recoil";
import Image from "next/image";
import Link from "next/link";

import { isLegacyViewMode } from "@repo/store";

import CodeBlock from "./CodeBlock";

export const NotionRenderer = ({ recordMap }: { recordMap: any }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const isLegacyMode = useRecoilValue(isLegacyViewMode);

  useEffect(() => {
    const elements = document.querySelectorAll(".notion-full-width");
    if (elements) {
      elements.forEach((e) => {
        e.classList.remove("notion-full-width");
      });
    }
  }, []);

  const components: Partial<NotionComponents> = useMemo(
    () => ({
      Code: CodeBlock,
      Image: Image,
      Link: Link,
    }),
    []
  );

  if (!recordMap?.block || Object.keys(recordMap.block).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-lg font-medium">This lesson is temporarily unavailable</p>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t load the content right now. Please refresh in a little while.
        </p>
      </div>
    );
  }

  return (
    <NotionRendererLib
      bodyClassName="text-base sm:text-lg"
      className={isLegacyMode ? "" : "pt-12 dark:!bg-[#0a0a0a]"}
      components={components}
      darkMode={isDarkMode}
      disableHeader
      fullPage
      recordMap={recordMap}
    />
  );
};
