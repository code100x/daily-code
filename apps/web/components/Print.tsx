"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export function Print() {
  const router = useRouter();

  useEffect(() => {
    // Open all <details> elements
    document.querySelectorAll("details").forEach((e) => (e.open = true));


    const closeWindow = () => {
      console.log("PDF has been printed.");
      window.close();
    };

    // Add event listener for 'afterprint' event
    window.addEventListener("afterprint", closeWindow);

    // Print the document
    print();

    // Clean up: Remove the event listener when component unmounts
    return () => {
      window.removeEventListener("afterprint", closeWindow);
    };
  }, [router]);

  return null;
}
