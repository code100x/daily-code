"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button } from "@repo/ui";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const [ themeMode, setThemeMode ] = useState<'light' | 'dark'>("light");
  

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.code === 'KeyD') {
            event.preventDefault();
            const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
            setTheme(newThemeMode);
            setThemeMode(newThemeMode);
        }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
}, [themeMode]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
