"use client";

import { getFunction } from "@repo/common";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from ".";

const getUserDetails = getFunction("getUserDetails");

export const AdminButton = () => {
  const admin = false;
  const router = useRouter();

  //TODO: propagate to state
  async function fetchUserDetailsClient() {
    try {
      const userDetails = await getUserDetails();
      alert(JSON.stringify(userDetails));
    } catch (e) {
      return [];
    }
  }

  useEffect(() => {
    fetchUserDetailsClient();
  });

  return (
    <div>
      {admin ? (
        <Button
          variant={"outline"}
          onClick={() => {
            router.push("/admin");
          }}
        >
          Admin
        </Button>
      ) : null}
    </div>
  );
};
