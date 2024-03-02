"use client";

import { Admin } from "@repo/ui/pages";
import { AppbarClient } from "../../components/AppbarClient";
import { ThemeProvider } from "../../components/ThemeContext";

export default function () {
  return (
    <>
      <ThemeProvider/>
      <AppbarClient />
      <Admin />
    </>
  );
}
