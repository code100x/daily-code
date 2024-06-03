"use client"
import React from "react";
import ScrollToTop from "react-scroll-to-top";
const ScrollToTopWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ScrollToTop smooth
      className={"flex justify-center items-center"}/>
      {children}
    </div>
  );
};

export default ScrollToTopWrapper;