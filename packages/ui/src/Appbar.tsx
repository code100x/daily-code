import Link from "next/link";
import { Button } from ".";
import { AdminButton } from "./AdminButton";
import { ModeToggle } from "./ModeToggle";
import { authOptions } from "../../../apps/web/lib/auth";
import { getServerSession } from "next-auth";
import { SearchDialog } from "./SearchDialog";
import { Track, Problem } from "@prisma/client";
import LoginButton from "./LoginButton";

export const Appbar = async ({ tracks }: { tracks: (Track & { problems: Problem[] })[] }) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const admin = session?.user?.admin;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 flex justify-center border-b shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl flex justify-between w-full">
        <Link href={"/"}>
          <div className="dark:text-zinc-100 text-zinc-950 text-2xl font-semibold">DailyCode</div>
        </Link>
        <div className="flex items-center gap-2">
          <SearchDialog tracks={tracks} />
          {admin && <AdminButton />}
          <LoginButton user={user} />

          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
