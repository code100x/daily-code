"use client";

import { useEffect, useState } from "react";
import { getFunction } from "@repo/common";
import { Button } from ".";
import { useRouter } from "next/navigation";

const getUserDetails = getFunction("getUserDetails");

export const AdminButton = () => {
  const [admin, _setAdmin] = useState(false);
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
