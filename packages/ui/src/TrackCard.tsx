import { Button } from "./shad/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./shad/ui/card";

import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Track, Problem } from "@prisma/client";

interface TrackCardProps extends Track {
  problems: Problem[];
  categories: {
    category: {
      id: string;
      category: string;
    };
  }[];
}

export function TrackCard({ track, index }: { track: TrackCardProps; index: number }) {
  return (
    <Card className="max-w-screen-md w-full cursor-pointer transition-all hover:border-primary/20 shadow-lg dark:shadow-black/60">
      <div className=" bg-red-300s flex justify-end ">
        <div className="border rounded-md  bg-white text-black text-2xl font-semibold px-4 m-2">{index}</div>
      </div>
      <CardHeader>
        <div className="flex flex-col sm:flex-row">
          <img src={track.image} className="min-h-[130px] sm:h-[130px] min-w-[130px] sm:w-[130px] rounded-xl"></img>
          <div className="pt-4 sm:pt-0 sm:pl-4">
            <CardTitle>{track.title}</CardTitle>
            <div>{track.description}</div>
            <CardDescription>
              {track.categories.map((item) => {
                return <div key={item.category.id}>{item.category.category}</div>;
              })}
            </CardDescription>
          </div>
        </div>
        <div className="flex justify-between">
          <h3 className="flex flex-col justify-center">{track.problems.length} Lessons</h3>
          <Button size={"lg"} className="flex items-center justify-center group">
            Explore
            <ChevronRightIcon className="pl-1 h-4 w-4 group-hover:translate-x-1 group-hover:hidden mt-[0.15rem] transition-all duration-150" />
            <ArrowRightIcon className="pl-1 h-4 w-4 hidden group-hover:block mt-[0.15rem] transition-all duration-150" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
