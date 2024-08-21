"use client";
import { NotionRenderer as NotionRendererLib } from "react-notion-x";
// import { Code } from "react-notion-x/build/third-party/code";
import CodeBlock from "./CodeBlock";
import { useTheme } from "next-themes";

// Week-4-1-647987d9b1894c54ba5c822978377910
export const NotionRenderer = ({ recordMap }: { recordMap: any }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className=".notion_ w-full .notion-bg-black">
      <style>
        {` 
            .notion-app {
                background: #f4f4f5;
                color: #000000
                }  
            .dark-mode {
                  background: #111827;                
                  color: #ffffff
                }
            .notion-title{
                font-family: open-montserrat;
                font-size: xxx-large;
            }
            .notion-list li{
                font-size: larger;
                font-family: open-poppins 
            }
            .notion-text{
                font-size: larger;
                font-family: open-poppins 
            }
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
          className="text-red-500 "
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
