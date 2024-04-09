"use client";
import Link from "next/link";
import { Button } from ".";
import { User } from "@repo/store";
import { auth } from "@repo/common";
import { useRouter } from "next/navigation";
import { AdminButton } from "./AdminButton";
import { ModeToggle } from "./ModeToggle";
import { SearchDialog } from "./SearchDialog";
import { Track, Problem } from "@prisma/client";
import ExcaliDraw from "./ ../../assets/excaliDrawBlack.svg";
import ExcaliDrawWhite from "./ ../../assets/excaliDrawWhite.svg";
import { useTheme } from "next-themes";

export const Appbar = ({
  user,
  tracks,
  currentMode,
}: {
  user: User | null;
  tracks: (Track & { problems: Problem[] })[];
  currentMode: string;
}) => {
  const { theme } = useTheme();
  console.log(theme);
  const router = useRouter();
  const admin = false;

  const redirectToExcaliDraw = () => {
    router.push("https://excalidraw.com/");
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 flex justify-center border-b shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl flex justify-between w-full">
        <Link href={"/"}>
          <div className="dark:text-zinc-100 text-zinc-950 text-2xl font-semibold">DailyCode</div>
        </Link>

        <div className="flex items-center gap-2">
          <Button className=" dark:rotate-0 dark:scale-100" variant={"outline"} onClick={redirectToExcaliDraw}>
            {theme === "light" ? (
              <img src={ExcaliDraw.src} alt="ExcaliDraw" />
            ) : (
              <img src={ExcaliDrawWhite.src} alt="ExcaliDraw" />
            )}
          </Button>

          <SearchDialog tracks={tracks} />
          {admin && <AdminButton />}

          {!user ? (
            <Button
              variant={"outline"}
              onClick={() => {
                router.push("/auth");
              }}
            >
              Login
            </Button>
          ) : (
            ""
          )}
          {user ? (
            <Button
              variant={"outline"}
              onClick={() => {
                auth.signOut().then(
                  function () {
                    // Sign-out successful.
                  },
                  function (_error) {
                    // An error happened.
                  }
                );
              }}
            >
              Logout
            </Button>
          ) : (
            ""
          )}

          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
