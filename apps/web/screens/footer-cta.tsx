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
      <div className="relative flex flex-col md:flex-col h-[75vh] md:h-[45vh] w-full rounded-3xl bg-gradient-to-b from-blue-400 to-blue-700 p-8 overflow-hidden">
        <div className="flex flex-col gap-4 justify-end">
          <div className="flex flex-col gap-2 md:w-[70%]">
            <h3 className="text-3xl font-medium text-white md:text-4xl tracking-tighter">
              Every developer deserves to be a great engineer, a{" "}
              <span className="font-bold tracking-tighter">100xEngineer!</span>
            </h3>

            <p className="text-lg md:text-xl text-white/80">
              Give yourself the power you deserve with a 100xdevs today!
            </p>
          </div>
          <div className="flex gap-2 flex-col md:flex-row">
            <Link href={"https://play.google.com/store/apps/details?id=com.hundredx.devs"} target="_blank">
              <Button size={"lg"} variant={"default"} className="w-fit flex items-center gap-2">
                <Download className="size-4" />
                Download Our App!
              </Button>
            </Link>
            <Link href={"https://harkirat.classx.co.in/new-courses"} target="_blank">
              <Button size={"lg"} variant={"secondary"} className="w-fit flex items-center gap-2">
                <Sparkles className="size-4" />
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
              className="absolute md:right-6 w-[80%] md:w-[30%] group-hover:-translate-y-4 group-hover:rotate-6 rotate-3 transition-all duration-300"
            />
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default FooterCTA;
