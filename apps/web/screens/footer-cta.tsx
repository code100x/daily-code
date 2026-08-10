"use client";
import { Button } from "@repo/ui";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const FooterCTA = () => {
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
            <Link href={"https://100xdevs.com/new-courses"} target="_blank">
              <Button size={"lg"} variant={"secondary"} className="w-fit flex items-center gap-2">
                <Sparkles className="size-4" />
                Join Now!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCTA;
