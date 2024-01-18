"use client";

import { Loader } from "@repo/ui/components"
import { useEffect } from "react";
import { getFunction } from "@repo/common";
import { useRouter } from "next/navigation";

export const RedirectToLastSolved = ({ trackId }: {trackId: string;}) => {
    const router = useRouter();
    
    useEffect(() => {
        const getLastSolved = getFunction("getLastSolved");
        try {
            getLastSolved({trackId})
                .then((res: any) => {
                    if (res.data.nextProblemId) {
                        router.push(`/tracks/${trackId}/${res.data.nextProblemId}`)
                        // window.location = `/tracks/${trackId}/${res.data.nextProblemId}`
                    }
                });
        } catch(e) {

        }
    }, [])

    return <div>
        <Loader />
    </div>
}