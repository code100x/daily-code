"use client";
import { useEffect } from "react";

export function Print() {
  // Some hack for strict mode
  let opened = false;
  useEffect(() => {
    if (opened) return;
    print();
    opened = true;
  }, []);

  return null;
}
