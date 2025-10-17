import Link from "next/link";
import { Button } from "@repo/ui";
import { ModeToggle } from "./ModeToggle";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import UserAccountDropDown from "./UserAccountDropDown";
import Image from "next/image";
import { motion } from "framer-motion";

export const Appbar = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky mx-auto wrapper top-0 z-50 flex items-center gap-2 py-6 w-full">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
        className="flex w-full justify-between mx-auto bg-white/80 dark:bg-neutral-900/80 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 backdrop-blur-2xl border border-primary/10 hover:border-blue-500/20 transition-all duration-300 p-5 md:p-6 rounded-3xl"
      >
        <Link href={"/"} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <Image
              src={"https://appx-wsb-gcp.akamai.net.in/subject/2023-01-17-0.17044360120951185.jpg"}
              alt="Logo"
              width={300}
              height={200}
              className="rounded-full size-11 relative z-10 ring-2 ring-primary/10 group-hover:ring-blue-500/30 transition-all duration-300"
            />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text hidden md:block group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
            100xProjects
          </span>
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <ModeToggle />
          {!user ? (
            <Button
              size={"lg"}
              onClick={async () => {
                await signIn();
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Login
            </Button>
          ) : (
            ""
          )}

          <UserAccountDropDown />
        </div>
      </motion.div>
    </nav>
  );
};
