import { Input, Label, Button } from "@repo/ui";
import { Pencil, Check, X } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserImage from "./UserImage";
import { User } from "@prisma/client";

export default function UserDetailForm({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to update name");

      await updateSession();
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  return (
    <form className="flex flex-col gap-4">
      <Label className="mb-2">Profile Picture</Label>
      <div className="flex items-center justify-center">
        <div className="flex !h-[6rem] !w-[6rem] items-center justify-center p-[0.2rem] hover:bg-[#030712]">
          <UserImage image={user?.image} key={user?.image} />
        </div>
      </div>

      <div>
        <Label className="">Your name</Label>
        <div className="mt-2 flex items-center gap-2">
          <Input
            disabled={!isEditing}
            value={isEditing ? name : user?.name || ""}
            onChange={(e) => setName(e.target.value)}
            className="p-2"
          />
          {!isEditing ? (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} type="button">
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={handleSubmit} type="button">
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsEditing(false);
                  setName(user?.name || "");
                }}
                type="button"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div>
        <Label className="">Your Email</Label>
        <Input disabled placeholder="Enter your name" value={user?.email ? user?.email : ""} className="mt-2 p-2" />
      </div>
    </form>
  );
}
