import Link from "next/link";
import { Button } from "../../../packages/ui/src/shad/ui/button";
import { Dialog, DialogContent } from "../../../packages/ui/src/shad/ui/dailog";
import { Track, Problem } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getLastNavigatedTrackHistory } from "./utils";

type TrackPreviewProps = {
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
  track: TrackCardProps;
};

interface TrackCardProps extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export function TrackPreview({ showPreview, setShowPreview, track }: TrackPreviewProps) {
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
    <Dialog open={showPreview} onOpenChange={() => setShowPreview(false)}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <div className="p-5">
          <div className="mb-6 relative">
            <img src={track.image} className="h-20 w-full object-cover rounded-lg" />
            <div className="text-3xl backdrop-blur-md font-black absolute w-full text-center -translate-y-14 drop-shadow-[2px_2px_var(--tw-shadow-color)] dark:shadow-stone-900 shadow-stone-100">
              {track.title}
            </div>
          </div>
          {track.categories.map((item: any, idx: number) => (
            <p key={item.category.id} className="inline-block text-sm font-extrabold mb-3 px-5">
              {item.category.category}{" "}
              <span className={`${track.categories[idx + 1] ? "inline-block" : "hidden"}`}> |&nbsp;</span>
            </p>
          ))}
          <p className="pb-5 px-5">{track.description}</p>
          <hr />
          <p className="mt-5 font-bold px-5 text-xl">Contents</p>
          <div className="max-h-[40vh] overflow-y-auto">
            {track.problems.map((topic: any, idx: number) => (
              <Link href={`/tracks/${track.id}/${track.problems[idx]?.id}`} key={idx}>
                <div className="hover:cursor-pointer my-2 rounded-md dark:hover:bg-slate-700 hover:bg-slate-200 px-5 py-1 transition-all duration-450 scroll-smooth">
                  {topic.title}
                </div>
              </Link>
            ))}
          </div>
          <div className="w-full flex justify-center">
            <div>
              <Button
                size={"lg"}
                className="flex items-center justify-center group"
                onClick={(e) =>{
                  navigateToTrack(track)
                  e.stopPropagation()
                }}
              >
                Start
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
