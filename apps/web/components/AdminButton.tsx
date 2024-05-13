"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui";
import { useRouter } from "next/navigation";

export const AdminButton = () => {
  const [admin, _setAdmin] = useState(false);
  const router = useRouter();

  //TODO: propagate to state
  async function fetchUserDetailsClient() {
    try {
      return [];
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
