"use client";

import { Loader } from "@repo/ui/components";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const RedirectToLastSolved = ({ trackId }: { trackId: string }) => {
  const router = useRouter();

  useEffect(() => {
    try {
      getLastSolved({ trackId }).then((res: any) => {
        if (res.data.nextProblemId) {
          router.replace(`/tracks/${trackId}/${res.data.nextProblemId}`);
          // window.location = `/tracks/${trackId}/${res.data.nextProblemId}`
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div>
      <Loader />
    </div>
  );
};
