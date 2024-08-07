"use client";
import { useTheme } from "next-themes";
import React from "react";
import ScrollToTop from "react-scroll-to-top";
const ScrollToTopWrapper = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      <ScrollToTop
        smooth
        className={"flex justify-center items-center !rounded-full dark:bg-zinc-950"}
        color={resolvedTheme == "light" ? "black" : "white"}
      />
      {children}
    </div>
  );
};

export default ScrollToTopWrapper;
