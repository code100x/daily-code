"use client";

import { useSearchParams } from "next/navigation";

export default function useCategorySearchParams() {
  const searchParams = useSearchParams();
  return searchParams.get("category");
}
