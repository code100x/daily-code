import * as React from "react"

import { Button } from "./shad/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./shad/ui/card";
import { Track } from "@repo/store";

export function TrackCard({ track }: {track: Track;}) {
  return (
    <Card className="max-w-screen-md w-full cursor-pointer">
      <CardHeader>
        <div className="flex">
            <img src={track.image} className="h-[130px] w-[130px] rounded-xl"></img>
            <div className="pl-4">
                <CardTitle>{track.title}</CardTitle>
                <div>{track.description}</div>
            </div>
        </div>
        <div className="flex justify-between">
            <h3 className="flex flex-col justify-center">
                {track.problems.length} Lessons
            </h3>
            <Button size={"lg"}>Explore</Button>
        </div>
      </CardHeader>
    </Card>
  )
}
