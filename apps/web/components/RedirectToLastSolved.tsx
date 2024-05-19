"use client";
import { Loader } from "./Loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFirstProblemForTrack } from "./utils";

export const RedirectToLastSolved = ({ trackId }: { trackId: string }) => {
  const router = useRouter();

  useEffect(() => {
    getFirstProblemForTrack(trackId).then((problemId) => {
      router.replace(`/tracks/${trackId}/${problemId}`);
    });
  }, [trackId]);

  return (
    <div>
      <Loader />
    </div>
  );
};
