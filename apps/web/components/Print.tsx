"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export function Print() {
  // Some hack for strict mode
  let opened = false;
  useEffect(() => {
    if (opened) return;
    document.querySelectorAll("details").forEach((e) => (e.open = true));
    print();
    opened = true;
    redirect("/");
  }, []);

  return null;
}
