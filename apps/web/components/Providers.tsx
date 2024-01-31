"use client";

import { RecoilRoot } from "recoil";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export const Providers = ({ children }: { children: React.ReactNode }) => {
   return <RecoilRoot>{children}</RecoilRoot>;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
