"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@repo/ui/components";

export const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <motion.button whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }} className="w-full">
        <Button
          size="lg"
          className="w-full cursor-pointer hover:bg-slate-900 z-10"
          variant="outline"
          onClick={async () => {
            await signIn("google");
          }}
        >
          <FcGoogle className="h-5 w-5" />
        </Button>
      </motion.button>
      <motion.button whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }} className="w-full">
        <Button
          size="lg"
          className="w-full hover:bg-slate-900 z-10"
          variant="outline"
          onClick={async () => {
            await signIn("github");
          }}
        >
          <FaGithub className="h-5 w-5" />
        </Button>
      </motion.button>
    </div>
  );
};
