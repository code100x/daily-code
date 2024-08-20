"use client";
import { NotionRenderer as NotionRendererLib } from "react-notion-x";
import CodeBlock from "./CodeBlock";
import { useTheme } from "next-themes";
import { CustomHeading } from "./CustomHeading";
import { CustomTextBlock } from "./CustomTextBlock";

export const NotionRenderer = ({ recordMap }: { recordMap: any }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="w-full">
      <style>
        {`
          .notion-header {
            display: none !important;
          }

          .notion-page {
            padding: 0px !important;
          }
        `}
      </style>
      <div className="rounded-full">
        <NotionRendererLib
          components={{
            Code: CodeBlock,
            Heading: CustomHeading,
            Text: CustomTextBlock,
          }}
          recordMap={recordMap}
          fullPage={true}
          darkMode={resolvedTheme === "dark"}
        />
      </div>
    </div>
  );
};
