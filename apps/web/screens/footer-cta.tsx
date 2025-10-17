"use client";
import { Button } from "@repo/ui";
import { Download, Sparkles } from "lucide-react";
import Link from "next/link";
import Mockup from "../public/Mockup.png";
import { motion } from "framer-motion";
import Image from "next/image";

const FooterCTA = () => {
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  };
  return (
    <div className="wrapper group">
      <div className="relative flex flex-col md:flex-col h-[75vh] md:h-[50vh] w-full rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-10 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        
        <div className="flex flex-col gap-6 justify-end relative z-10">
          <div className="flex flex-col gap-4 md:w-[70%]">
            <h3 className="text-4xl font-bold text-white md:text-5xl tracking-tight leading-tight">
              Every developer deserves to be a great engineer, a{" "}
              <span className="font-extrabold tracking-tight bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                100xEngineer!
              </span>
            </h3>

            <p className="text-xl md:text-2xl text-white/90 font-medium">
              Give yourself the power you deserve with 100xdevs today!
            </p>
          </div>
          <div className="flex gap-4 flex-col md:flex-row">
            <Link href={"https://play.google.com/store/apps/details?id=com.hundredx.devs"} target="_blank">
              <Button size={"lg"} variant={"default"} className="w-fit flex items-center gap-2 bg-white text-blue-700 hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold">
                <Download className="size-5" />
                Download Our App!
              </Button>
            </Link>
            <Link href={"https://harkirat.classx.co.in/new-courses"} target="_blank">
              <Button size={"lg"} variant={"secondary"} className="w-fit flex items-center gap-2 bg-yellow-400 text-blue-900 hover:bg-yellow-300 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold">
                <Sparkles className="size-5" />
                Join Now!
              </Button>
            </Link>
          </div>
        </div>
        <Link href={"https://play.google.com/store/apps/details?id=com.hundredx.devs"} target="_blank">
          <motion.div animate={floatingAnimation} className="absolute md:right-6 md:top-12 w-full justify-end mx-auto">
            <Image
              src={Mockup}
              alt="Mockup"
              className="absolute md:right-6 w-[80%] md:w-[30%] group-hover:-translate-y-6 group-hover:rotate-6 rotate-3 transition-all duration-500 drop-shadow-2xl"
            />
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default FooterCTA;
