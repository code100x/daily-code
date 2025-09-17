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
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], type: "spring", damping: 12 }}
        className="flex w-full justify-between mx-auto glass-nav shadow-medium hover:shadow-strong p-6 rounded-2xl transition-all duration-300 hover:border-primary/20"
      >
        <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
          <Image
            src={"https://appx-wsb-gcp.akamai.net.in/subject/2023-01-17-0.17044360120951185.jpg"}
            alt="Logo"
            width={300}
            height={200}
            className="rounded-full size-10"
          />
          <span className="text-lg md:text-2xl font-bold tracking-tight text-gradient hidden md:block">
            100xProjects
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <ModeToggle />
          {!user ? (
            <Button
              size={"lg"}
              onClick={async () => {
                await signIn();
              }}
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
