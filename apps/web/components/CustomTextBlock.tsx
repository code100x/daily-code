import React from "react";
import styles from "./CustomTextBlock.module.css";

export const CustomTextBlock = ({ children }: { children: React.ReactNode }) => {
  return <p className={styles.textBlock}>{children}</p>;
};
