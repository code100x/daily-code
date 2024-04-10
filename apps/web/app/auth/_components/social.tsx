"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth } from "@repo/common";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider } from "firebase/auth";
import { motion } from "framer-motion";
import { Button } from "@repo/ui/components";

const provider = new GoogleAuthProvider();

export const Social = () => {
  const router = useRouter();
  async function onSignin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          return;
        }
        router.push("/");
      })
      .catch(() => {
        alert("erorr while signing in");
      });
  }

  return (
    <div className="flex items-center w-full gap-x-2">
      <motion.button whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }} className="w-full">
        <Button
          size="lg"
          className="w-full cursor-pointer hover:bg-slate-900 z-10"
          variant="outline"
          onClick={() => onSignin()}
        >
          <FcGoogle className="h-5 w-5" />
        </Button>
      </motion.button>
      <motion.button whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }} className="w-full">
        <Button size="lg" className="w-full hover:bg-slate-900 z-10" variant="outline">
          <FaGithub className="h-5 w-5" />
        </Button>
      </motion.button>
    </div>
  );
};
