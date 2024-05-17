"use client";
import React from "react";
import UserImage from "./UserImage";
import { UserRound } from "lucide-react";
import ProfileOptions from "./profile/ProfileOptions";
import { useRecoilValue } from "recoil";
import { profileSidebar } from "@repo/store";
import { useSession } from "next-auth/react";

export default function ProfileSidebar() {
  const sidebarToggle = useRecoilValue(profileSidebar);
  const session = useSession();
  const user = session.data?.user;

  return (
    <>
      <div
        className={`${sidebarToggle ? "block transition-all  dark:bg-[#06080d] py-3 lg:dark:bg-[#1d26435c] z-20 duration-100 fixed top-0 left-0 w-[60%] lg:w-[50%]" : "hidden  lg:block"}  col-span-2  top-10 h-full`}
      >
        <div className="dark:bg-[#1d26435c] sticky top-[4.5rem] dark:border-none border-2 bg-white px-2 rounded-2xl flex flex-col items-center  max-h-[100vh] min-h-[100vh] py-6">
          <div className="relative text-center flex flex-col items-center justify-center">
            <div className="w-[6rem] mb-4 h-[6rem]">
              {!user?.image ? (
                <div className="p-1 h-full flex items-center justify-center w-full border-2 rounded-full dark:border-[#ffffffab] border-[#1a1a1a]">
                  <UserRound size={55} />
                </div>
              ) : (
                <UserImage image={user?.image} />
              )}
            </div>
            <div className="font-bold text-lg">{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>

          <div className="my-6 w-full"></div>

          <ProfileOptions />
        </div>
      </div>
    </>
  );
}
