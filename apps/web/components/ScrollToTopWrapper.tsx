"use client";
import { useTheme } from "next-themes";
import React from "react";
import ScrollToTop from "react-scroll-to-top";
const ScrollToTopWrapper = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      <ScrollToTop smooth className={"flex justify-center items-center !rounded-full "} style={{ zIndex: 100 }} />
      {children}
    </div>
  );
};

export default ScrollToTopWrapper;
