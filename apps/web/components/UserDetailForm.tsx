import { Input, Label } from "@repo/ui";
import React from "react";
import UserImage from "./UserImage";
import { User } from "@prisma/client";

export default function UserDetailForm({ user }: { user: User }) {
  return (
    <form className="flex flex-col gap-4">
      <Label className="mb-2">Profile Picture</Label>
      <div className="flex items-center justify-center">
        <div className="!w-[6rem] !h-[6rem] flex items-center hover:bg-[#030712] p-[0.2rem] justify-center ">
          <UserImage image={user?.image} key={user?.image} />
        </div>
      </div>

      <div>
        <Label className="">Your name</Label>
        <Input disabled placeholder="Enter your name" value={user?.name ? user?.name : ""} className="p-2 mt-2" />
      </div>
      <div>
        <Label className="">Your Email</Label>
        <Input disabled placeholder="Enter your name" value={user?.email ? user?.email : ""} className="p-2 mt-2" />
      </div>
    </form>
  );
}
