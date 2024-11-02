"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Header = ({ title }: { title: string }) => (
  <motion.div
    className={`z-[50] flex w-full flex-col justify-between gap-2 p-6 md:flex-row`}
    initial={{ y: 0 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-2">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", type: "spring", damping: 10 }}
        className="flex justify-between gap-2"
      >
        <div
          className={`border-primary/10 flex items-center gap-4 rounded-lg border bg-black/10 p-2 backdrop-blur-lg transition-all duration-500 ease-in-out`}
        >
          <Link href={"/"} className="cursor-pointer items-center gap-4">
            <Image
              src={"https://appx-wsb-gcp.akamai.net.in/subject/2023-01-17-0.17044360120951185.jpg"}
              alt="Logo"
              width={200}
              height={200}
              className="size-8 rounded-full"
            />
          </Link>
          <h4 className="flex items-center gap-2 font-medium tracking-tighter md:max-w-[50vw] md:text-lg">{title}</h4>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default function CanvaTrack() {
  const searchParams = useSearchParams();
  const canvaLink = searchParams.get("canvaLink");
  const title = searchParams.get("title");

  const embedUrl = canvaLink?.includes("?embed") ? canvaLink : `${canvaLink}?embed`;

  console.log({ canvaLink, embedUrl });

  if (!embedUrl) {
    return <div>No Canva presentation link provided</div>;
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Header title={title ?? ""} />
      <div className="w-full flex-1">
        <div className="relative h-full w-full">
          <iframe
            loading="lazy"
            className="absolute left-0 top-0 h-full w-full border-none"
            src={embedUrl}
            allowFullScreen={true}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
