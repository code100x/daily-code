"use client";

import { useRecoilValue } from "recoil";
import { userAtom } from "@repo/store";
import { Appbar } from "@repo/ui/components";
import { Track, Problem } from "@prisma/client";

export const AppbarClient = ({ tracks }: { tracks: (Track & { problems: Problem[] })[] }) => {
  const user = useRecoilValue(userAtom);
  return <Appbar user={user} tracks={tracks} />;
};
