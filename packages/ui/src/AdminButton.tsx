"use client";

import { useEffect, useState } from "react";
import { Button } from ".";
import { useRouter } from "next/navigation";

export const AdminButton = () => {
  const router = useRouter();
  return (
    <div>
      <Button
        variant={"outline"}
        onClick={() => {
          router.push("/admin");
        }}
      >
        Admin
      </Button>
    </div>
  );
};
