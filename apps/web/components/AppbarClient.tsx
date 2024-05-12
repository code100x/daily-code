"use client";

import { Appbar } from "../components/Appbar";
import { Track, Problem } from "@prisma/client";

export const AppbarClient = ({ tracks }: { tracks: (Track & { problems: Problem[] })[] }) => {
  return <Appbar tracks={tracks} />;
};
