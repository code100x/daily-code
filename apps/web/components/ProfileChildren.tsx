"use client";
import React from "react";
import { Providers, ThemeProvider } from "./Providers";
import { useRecoilState } from "recoil";
import { profileSidebar } from "@repo/store";
import { Menu } from "lucide-react";

export default function ProfileChilldren({ children }: { children: React.ReactNode }) {
  const [sidebarToggle, setSidebarToggle] = useRecoilState(profileSidebar);
  return (
    <div
      className={`border-2 h-[88vh] lg:h-auto overflow-y-auto rounded-md ${sidebarToggle ? "col-span-8 lg:col-span-6" : "col-span-8 lg:col-span-6"}  w-full`}
    >
      <div
        onClick={() => setSidebarToggle((prev) => !prev)}
        className="absolute cursor-pointer top-[7rem] right-[4rem] block lg:hidden"
      >
        <Menu />
      </div>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Providers>{children}</Providers>
      </ThemeProvider>
    </div>
  );
}
