import React from "react";
import styles from "./CustomHeading.module.css";

export const CustomHeading = ({ children, level }: { children: React.ReactNode; level: number }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={styles[`heading${level}`]}>{children}</Tag>;
};
