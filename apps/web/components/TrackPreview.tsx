"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../../packages/ui/src/shad/ui/button";
import { Dialog, DialogContent } from "../../../packages/ui/src/shad/ui/dailog";
import { EnterIcon } from "@radix-ui/react-icons";

type TrackPreviewProps = {
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
  track: any;
};

const truncateDescription = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + " ...";
  }
  return text;
};

export function TrackPreview({ showPreview, setShowPreview, track }: TrackPreviewProps) {
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(false);

  const updateScreenSize = () => {
    setIsMediumOrLarger(window.innerWidth >= 768);
  };

  useEffect(() => {
    updateScreenSize(); // Set the initial state
    window.addEventListener("resize", updateScreenSize); // Add resize listener

    return () => {
      window.removeEventListener("resize", updateScreenSize); // Cleanup listener on unmount
    };
  }, []);

  const truncatedDescription = isMediumOrLarger ? track.description : truncateDescription(track.description, 15);

  return (
    <Dialog open={showPreview} onOpenChange={() => setShowPreview(false)}>
      <DialogContent className="max-w-2xl h-max flex items-center">
        <div className="p-5">
          <div className="mb-6 relative">
            <img src={track.image} className="h-20 w-full scale-90 object-cover rounded-lg" />
            <div className="text-xl md:text-3xl backdrop-blur-md font-black absolute w-full text-center -translate-y-14 drop-shadow-[2px_2px_var(--tw-shadow-color)] dark:shadow-stone-900 shadow-stone-100">
              {track.title}
            </div>
          </div>
          {track.categories.map((item: any, idx: number) => (
            <p key={item.category.id} className="inline-block text-sm font-extrabold mb-3 md:px-5">
              {item.category.category}{" "}
              <span className={`${track.categories[idx + 1] ? "inline-block" : "hidden"}`}> |&nbsp;</span>
            </p>
          ))}
          <p className="pb-5 md:px-5">{truncatedDescription}</p>
          <hr />
          <p className="mt-5 font-bold md:px-5 text-xl">Contents</p>
          <div className="max-h-[40vh] overflow-y-auto">
            {track.problems.map((topic: any, idx: number) => (
              <Link key={topic.id} href={`/tracks/${track.id}/${track.problems[idx]?.id}`}>
                <div className="hover:cursor-pointer flex items-center justify-between my-2 rounded-md dark:hover:bg-slate-700 hover:bg-slate-200 md:px-5 py-1 transition-all duration-450 scroll-smooth">
                  {topic.title}
                  <div className="pr-2">
                    <EnterIcon />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="w-full flex justify-center">
            <Link href={track.problems.length ? `/tracks/${track.id}/${track.problems[0]?.id}` : ""}>
              <Button
                size={"lg"}
                className="flex my-4 items-center justify-center group"
                onClick={(e) => e.stopPropagation()}
              >
                Start
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
