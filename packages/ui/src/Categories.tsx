"use client";
import { Button } from "./shad/ui/button";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { category } from "@repo/store";

export const Categories = ({ categories }: { categories: { category: string }[] }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useRecoilState(category);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1536);
    };

    handleResize(); // Call the function once to set initial state

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener when component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  function handleFilterButton(category: string) {
    setSelectedCategory((prevCategory) => (prevCategory === category ? "" : category));
  }

  return (
    <div
      className={`flex justify-center mx-auto border-2 rounded-full py-1 ${!isMobile ? "flex-row w-2/3" : "flex-col w-fit"}`}
    >
      {!isMobile ? (
        categories.map((category) => (
          <Button
            key={category.category}
            variant="ghost"
            onClick={() => handleFilterButton(category.category)}
            className={selectedCategory === category.category ? "bg-gray-100 dark:bg-slate-700" : ""}
          >
            {category.category}
          </Button>
        ))
      ) : (
        <select
          className="bg-transparent justify-center p-2 mx-1"
          name="category"
          id="category"
          onChange={(e) => handleFilterButton(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.category} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
