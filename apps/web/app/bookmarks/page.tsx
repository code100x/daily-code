import React from "react";
import { getAllBookmarkedTrack, getAllTracks } from "../../components/utils";
import { AppbarClient } from "../../components/AppbarClient";
import { TrackCard } from "@repo/ui/components";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

interface ExtendedSession extends Session {
  user: {
    user: string;
    email: string;
    id: string;
  };
}

const page = async () => {
  const session: ExtendedSession | null = await getServerSession(authOptions);

  const userid = session?.user.id;
  const tracks = await getAllTracks();

  // fetches all the bookmarked tracks of user logged in
  const BookmarkedTracks = await getAllBookmarkedTrack(userid!);

  const BookMarkId = BookmarkedTracks.map((bkmark) => bkmark.track);
  // filtering out the bookmarked tracks from all the tracks
  const FilteredBookmarks = tracks.filter((track) => BookMarkId.includes(track.id));
  if (session === null) {
    redirect("/");
  }
  return (
    <div>
      <AppbarClient tracks={tracks} />
      {FilteredBookmarks.length === 0 ? (
        <div className="text-center text-3xl font-semibold p-5 m-5">No Booksmarks Yet!</div>
      ) : (
        <ul className="p-8 md:20 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 w-full">
          {FilteredBookmarks.map((track) => (
            <li key={track.id} className="flex justify-center">
              <div className="max-w-screen-md w-full block">
                <TrackCard track={track} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default page;
