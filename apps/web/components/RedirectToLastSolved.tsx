"use client";

import { Loader } from "@repo/ui/components";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { getFirstProblemForTrack } from "./utils";

export const RedirectToLastSolved = ({ trackId }: { trackId: string }) => {
  const router = useRouter();

  useEffect(() => {
    const problemId = getFirstProblemForTrack(trackId);
    try {
      router.replace(`/tracks/${trackId}/${problemId}`);
    } catch (e) {
      console.error(e);
    }
  }, [trackId]);

  return (
    <div>
      <Loader />
    </div>
  );
};
