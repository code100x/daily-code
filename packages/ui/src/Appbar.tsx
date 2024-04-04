import Link from "next/link";
import { Button } from ".";
import { useRouter } from "next/navigation";
import { AdminButton } from "./AdminButton";
import { ModeToggle } from "./ModeToggle";
import { signIn, signOut } from "next-auth/react";

import { useSession } from "next-auth/react";
export const Appbar = () => {
  const session = useSession();
  const user = session.data?.user;
  const admin = false;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 flex justify-center border-b shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl flex justify-between w-full">
        <Link href={"/"}>
          <div className="dark:text-zinc-100 text-zinc-950 text-2xl font-semibold">DailyCode</div>
        </Link>
        <div className="flex items-center gap-2">
          {admin && <AdminButton />}

          {!user ? (
            <Button
              variant={"outline"}
              onClick={async () => {
                await signIn();
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
              onClick={async () => {
                await signOut();
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
