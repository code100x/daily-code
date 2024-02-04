import Link from "next/link";
import { Button } from ".";
import { User } from "@repo/store";
import { auth } from "@repo/common";
import { useRouter } from "next/navigation";
import { AdminButton } from "./AdminButton";
import { ModeToggle } from "./ModeToggle";

export const Appbar = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const admin = false;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 flex justify-center border-b shadow-md">
      <div className="max-w-screen-xl flex justify-between w-full">
        <Link href={"/"}>
          <div className="dark:text-zinc-100 text-zinc-950 text-2xl font-semibold">DailyCode</div>
        </Link>
        <div className="flex items-center gap-2">
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
