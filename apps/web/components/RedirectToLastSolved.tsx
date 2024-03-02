"use client";

import { Loader } from "@repo/ui/components";
import { useEffect } from "react";
import { getFunction } from "@repo/common";
import { useRouter } from "next/navigation";
import { useTheme } from '../../Components/ThemeContext'; 

export const RedirectToLastSolved = ({ trackId }: { trackId: string }) => {
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const getLastSolved = getFunction("getLastSolved");
    try {
      getLastSolved({ trackId }).then((res: any) => {
        if (res.data.nextProblemId) {
          router.push(`/tracks/${trackId}/${res.data.nextProblemId}`);
          // window.location = `/tracks/${trackId}/${res.data.nextProblemId}`
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, [theme, router, trackId]);

  return (
    <div>
      <Loader />
    </div>
  );
};

    </div>
  );
};
