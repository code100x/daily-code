"use client";
import { Card, CardDescription, CardHeader, CardTitle, Button } from "@repo/ui";
import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Track, Problem } from "@prisma/client";
import { useState } from "react";
import { TrackPreview } from "./TrackPreview";
import { getLastNavigatedTrackHistory } from "./utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TrackCardProps extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export function TrackCard({ track }: { track: TrackCardProps }) {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const session = useSession();
  const router = useRouter();

  const navigateToTrack = async (track: TrackCardProps) => {
    if (session.data?.user) {
      let user: any = session.data.user;
      const userId = user.id;
      const lastTrack = await getLastNavigatedTrackHistory(userId, track.id);
      if (lastTrack) {
        const url = `/tracks/${track.id}/${lastTrack}`;
        router.push(url);
        return;
      }
    }
    router.push(`/tracks/${track.id}/${track.problems[0]?.id}`);
  };

  return (
    <>
      <Card
        className="max-w-screen-md w-full cursor-pointer transition-all hover:border-primary/20 shadow-lg dark:shadow-black/60"
        onClick={() => setShowPreview(true)}
      >
        <CardHeader>
          <div className="flex flex-col sm:flex-row">
            <img src={track.image} className="min-h-[130px] sm:h-[130px] min-w-[130px] sm:w-[130px] rounded-xl"></img>
            <div className="pt-4 sm:pt-0 sm:pl-4 flex flex-col justify-between">
              <div>
                <CardTitle>{track.title}</CardTitle>
                <CardDescription>
                  <div>{track.description.slice(0, 180) + (track.description.length > 180 ? "..." : "")}</div>
                </CardDescription>
              </div>
              <div>
                {track.categories.map((item, idx) => (
                  <p key={item.category.id} className="inline-block">
                    {item.category.category}{" "}
                    <span className={`${track.categories[idx + 1] ? "inline-block" : "hidden"}`}> |&nbsp;</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <h3 className="flex flex-col justify-center">{track.problems.length} Lessons</h3>
            <div>
              <Button
                size={"lg"}
                className="flex items-center justify-center group"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateToTrack(track)
                }}
              >
                Start
                <ChevronRightIcon className="pl-1 h-4 w-4 group-hover:translate-x-1 group-hover:hidden mt-[0.15rem] transition-all duration-150" />
                <ArrowRightIcon className="pl-1 h-4 w-4 hidden group-hover:block mt-[0.15rem] transition-all duration-150" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      <TrackPreview showPreview={showPreview} setShowPreview={setShowPreview} track={track} />
    </>
  );
}
