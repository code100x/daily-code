"use client";

import { Admin } from "@repo/ui/pages";
import { AppbarClient } from "../../components/AppbarClient";
import { Toast } from "@repo/ui/toast";

export default function () {
  return (
    <>
      <AppbarClient tracks={[]} />
      <Admin />
      <Toast />
    </>
  );
}
