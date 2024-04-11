"use client";

import { CardWrapper } from "../app/auth/_components/CardWrapper";
import { SparklesPreview2 } from "../app/auth/_components/sparkles";

export const Signin = () => {
  return (
    <SparklesPreview2>
      <CardWrapper
        children
        headerLabel="Welcome to DailyCode"
        backButtonlabel="Back to Home"
        backButtonHref="/"
        showSocial={true}
      />
    </SparklesPreview2>
  );
};
