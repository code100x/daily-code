"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export function Print() {
  useEffect(() => {
    let opened = false;
    if (opened) return;

    
    document.querySelectorAll("details").forEach((e) => (e.open = true));

    
    print();

    
    opened = true;
  }, []);

  
  useEffect(() => {
    const timeout = setTimeout(() => {
      redirect("/");
    }, 1000); 

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
