"use client";

import { useRecoilValue } from "recoil";
import { userAtom } from "@repo/store";
import { Appbar } from "@repo/ui/components";

export const AppbarClient = () => {
  return <Appbar />;
};
