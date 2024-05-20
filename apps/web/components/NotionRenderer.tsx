"use client";
import { NotionRenderer as NotionRendererLib } from "react-notion-x";
// import { Code } from "react-notion-x/build/third-party/code";
import CodeBlock from "./CodeBlock";
import { useTheme } from "next-themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { MoonIcon, NotionLogoIcon, SunIcon, TriangleDownIcon, TriangleRightIcon } from "@radix-ui/react-icons";
import { notionThemeState } from "../../../packages/store/src/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

// Week-4-1-647987d9b1894c54ba5c822978377910
export const NotionRenderer = ({ recordMap }: { recordMap: any }) => {
  const { resolvedTheme } = useTheme();
  const [collapsedBlocks, setCollapsedBlocks] = useState(false);
  const [areTogglesAvailable, setAreTogglesAvailable] = useState(false);
  const setNotionThemeState = useSetRecoilState(notionThemeState);
  const notionDarkTheme = useRecoilValue(notionThemeState);

  useEffect(() => {
    setAreTogglesAvailable(document.querySelectorAll(".notion-toggle").length > 0);
  }, []);

  const expandAllToggles = () => {
    const toggles = document.querySelectorAll(".notion-toggle");
    toggles.forEach((toggle) => {
      if (collapsedBlocks) {
        toggle.removeAttribute("open");
        setCollapsedBlocks(false);
      } else {
        toggle.setAttribute("open", "");
        setCollapsedBlocks(true);
      }
    });
  };

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
      <div className="relative">
        <div className="absolute top-0 right-0 mr-4 mt-4 px-4 py-2 z-10">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-violet11 bg-gray-800 shadow-[0_2px_10px] shadow-black outline-none hover:bg-gray-700"
              >
                <NotionLogoIcon />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] bg-gray-900 rounded-md p-[5px] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              >
                {areTogglesAvailable && (
                  <DropdownMenu.Item
                    className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-600 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 cursor-pointer"
                    onClick={expandAllToggles}
                  >
                    {collapsedBlocks ? "Collapse " : "Expand "}All Toggles
                    <div className="ml-auto pl-[20px] text-gray-500 group-data-[highlighted]:text-white group-data-[disabled]:text-gray-600">
                      {collapsedBlocks ? <TriangleDownIcon /> : <TriangleRightIcon />}
                    </div>
                  </DropdownMenu.Item>
                )}

                <DropdownMenu.CheckboxItem
                  className="group text-[13px] leading-none text-gray-300 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-gray-600 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-700 data-[highlighted]:text-gray-100"
                  checked={notionDarkTheme}
                  onCheckedChange={setNotionThemeState}
                >
                  Change Theme{" "}
                  <div className="ml-auto pl-[20px] text-gray-400 group-data-[highlighted]:text-white group-data-[disabled]:text-gray-600">
                    {notionDarkTheme ? <MoonIcon /> : <SunIcon />}
                  </div>
                </DropdownMenu.CheckboxItem>

                <DropdownMenu.Arrow className="fill-gray-900" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <NotionRendererLib
          components={{
            Code: CodeBlock,
          }}
          recordMap={recordMap}
          fullPage={true}
          darkMode={resolvedTheme === (notionDarkTheme ? "dark" : "light")}
        />
      </div>
    </div>
  );
};
