"use client";
import { Button } from "@repo/ui/components";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

interface BackButtonProps {
  label: string;
  href: string;
}

export const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button size="sm" variant="link" className="font-normal w-full z-10 hover:animate-pulse" asChild>
      <Link href={href}>
        <BiArrowBack className="h-4 w-3 mr-1 text-white" />
        {label}
      </Link>
    </Button>
  );
};
