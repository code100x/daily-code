"use client";
import Link from "next/link";
import { Button } from "@repo/ui";
import { Dialog, DialogClose, DialogContent } from "@repo/ui";
import { ScrollArea } from "@repo/ui";
import { EnterIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

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
      <DialogContent className="rounded-lg">
        <div className="p-2">
          <div className="mb-6 relative">
            <img src={track.image} className="h-20 w-full object-cover rounded-lg" />
            <div className="text-3xl backdrop-blur-md font-black absolute w-full text-center -translate-y-14 drop-shadow-[2px_2px_var(--tw-shadow-color)] dark:shadow-stone-900 shadow-stone-100">
              {track.title}
            </div>
          </div>
          <div className="p-2 m-2 bg-gray-200 overflow-hidden rounded-lg text-xl h-fit w-fit text-zinc-600">
            {track.categories.map((item: any, idx: number) => (
              <p key={item.category.id} className="inline-block text-sm font-extrabold  ">
                {item.category.category}{" "}
                <span className={`${track.categories[idx + 1] ? "inline-block" : "hidden"}`}> |&nbsp;</span>
              </p>
            ))}
          </div>
          <p className="pb-5 px-3">{truncatedDescription}</p>
          <hr />
          <p className="mt-5 font-bold px-3 text-xl">Contents</p>
          <ScrollArea className="h-72 rounded-md border m-2">
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              {track.problems.map((topic: any, idx: number) => (
                <Link href={`/tracks/${track.id}/${track.problems[idx]?.id}`}>
                  <div className="hover:cursor-pointer flex items-center justify-between my-2 rounded-md dark:hover:bg-slate-700 hover:bg-slate-200 md:px-5 py-1 transition-all duration-450 scroll-smooth">
                    <li>{topic.title}</li>
                    <div className="pr-2">
                      <EnterIcon />
                    </div>
                  </div>
                </Link>
              ))}
            </ul>
          </ScrollArea>
          <div className="w-full flex justify-center mt-4 gap-6">
            <DialogClose asChild>
              <Button type="button" variant="secondary" size={"lg"}>
                Close
              </Button>
            </DialogClose>
            <Link href={track.problems.length ? `/tracks/${track.id}/${track.problems[0]?.id}` : ""}>
              <Button
                size={"lg"}
                className="flex items-center justify-center group"
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
