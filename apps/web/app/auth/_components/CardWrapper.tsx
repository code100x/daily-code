"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "../../../../../packages/ui/src/shad/ui/card";
import { HeaderSection } from "./Header";
import { Social } from "./Social";
import { BackButton } from "./BackButton";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonlabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonlabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 0.9, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full items-center justify-center"
    >
      <Card className="lg:w-[450px] w-[400px] h-[280px] border-slate-100 items-center justify-center flex flex-col bg-black shadow-md backdrop-blur-sm">
        <CardHeader>
          <HeaderSection label={headerLabel} />
        </CardHeader>
        <CardContent>{children}</CardContent>
        {showSocial && (
          <CardFooter>
            <Social />
          </CardFooter>
        )}
        <CardFooter>
          <BackButton label={backButtonlabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </motion.div>
  );
};
