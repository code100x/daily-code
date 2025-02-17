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
      className={`h-[88vh] overflow-y-auto rounded-md border-2 lg:h-auto ${sidebarToggle ? "col-span-8 lg:col-span-6" : "col-span-8 lg:col-span-6"} w-full`}
    >
      <div
        onClick={() => setSidebarToggle((prev) => !prev)}
        className="absolute right-[4rem] top-[7rem] block cursor-pointer lg:hidden"
      >
        {/* <Menu /> */}
      </div>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Providers>{children}</Providers>
      </ThemeProvider>
    </div>
  );
}
