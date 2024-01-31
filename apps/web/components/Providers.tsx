"use client";

import { RecoilRoot } from "recoil"
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import {ToastProvider} from "@repo/ui/toast";

export const Providers = ({children}: {children: React.ReactNode}) => {
    return <RecoilRoot>
        <ToastProvider>
            {children}
        </ToastProvider>
    </RecoilRoot>
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}