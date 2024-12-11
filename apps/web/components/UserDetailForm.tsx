import { Input, Label, Button } from "@repo/ui";
import { Pencil, Check, X } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UserImage from "./UserImage";
import { User } from "@prisma/client";

export default function UserDetailForm({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error("Failed to update name");
      setIsEditing(false);
      router.refresh(); // Refresh the page to update session data
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

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
        <div className="flex items-center gap-2 mt-2">
          <Input
            disabled={!isEditing}
            value={isEditing ? name : (user?.name || "")}
            onChange={(e) => setName(e.target.value)}
            className="p-2"
          />
          {!isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              type="button"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSubmit}
                type="button"
              >
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
        <Input disabled placeholder="Enter your name" value={user?.email ? user?.email : ""} className="p-2 mt-2" />
      </div>
    </form>
  );
}
