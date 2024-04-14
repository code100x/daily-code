"use client";

import { useEffect, useState } from "react";
import { Button } from ".";
import { useRouter } from "next/navigation";

export const AdminButton = () => {
  const [admin, _setAdmin] = useState(false);
  const router = useRouter();
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
