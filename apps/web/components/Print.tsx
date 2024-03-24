"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Print() {
  const router = useRouter();

  useEffect(() => {
    // Open all <details> elements
    document.querySelectorAll("details").forEach((e) => (e.open = true));

    // Wait for a short time before printing
    setTimeout(() => {
      print();

      // close the window after printing
      window.close();
    }, 1000); // Wait for 1 second before printing
  }, [router]);

  return null;
}
