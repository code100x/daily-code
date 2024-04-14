import { Appbar } from "@repo/ui/components";
import { Track, Problem } from "@prisma/client";

export const AppbarClient = ({ tracks }: { tracks: (Track & { problems: Problem[] })[] }) => {
  return <Appbar tracks={tracks} />;
};
