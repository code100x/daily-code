
import { Track } from "@repo/store";
import { getFunction } from "@repo/common";
import { TrackCard } from "@repo/ui/components";
import Link from "next/link";
import { AppbarClient } from "../components/AppbarClient";

async function getTracks() {
    const getTrancksFn = getFunction("getTracks")
    try {
        const tracks: any = await getTrancksFn();
        console.log(tracks);
        return tracks.data.tracks || [];
    } catch (e) {
        return [];
    }
}

export async function Landing() {
    const tracks = await getTracks()

    return <div>
        <AppbarClient />
        <div className="flex justify-center pt-4">
            <div className="text-white text-4xl p-2 max-w-screen-md">
                Learning Paths
            </div>
        </div>
        <div>
            <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2">
                {tracks.map((t: Track) => !t.hidden && <li key={t.id}>
                    <Link className="max-w-screen-md w-full" href={`/tracks/${t.id}`}>
                        <TrackCard track={t} />
                    </Link>
                </li>)}
            </ul>
        </div>
    </div>
}
