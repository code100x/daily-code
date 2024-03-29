"use client";
import { useEffect } from "react";

export function Print() {
  // Some hack for strict mode
  let opened = false;
  useEffect(() => {
    if (opened) return;
    document.querySelectorAll("details").forEach((e) => (e.open = true));
    print();
    opened = true;
  }, []);

  return null;
}
