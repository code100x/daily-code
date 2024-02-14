"use client";
import { NotionRenderer as NotionRendererLib } from "react-notion-x";
import { Code } from "react-notion-x/build/third-party/code";
import { useEffect, useState } from "react";

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";
import { useTheme } from "next-themes";

// Week-4-1-647987d9b1894c54ba5c822978377910
export const NotionRenderer = ({ recordMap }: { recordMap: any }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="">
      <style>
        {`
          .notion-header {
            display: none !important;
          }
        `}
      </style>
      <div className="rounded-full">
        <NotionRendererLib
          components={{
            Code,
          }}
          recordMap={recordMap}
          fullPage={true}
          darkMode={resolvedTheme === "dark"}
        />
      </div>
    </div>
  );
};
