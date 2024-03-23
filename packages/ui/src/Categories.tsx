"use client";
import { Button } from "./shad/ui/button";
import { useRecoilState } from "recoil";
import { category } from "@repo/store";

export const Categories = () => {
  function handleFilterButton(category: string) {
    if (category == selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  }
  const categories = ["Web Development (Basics)", "Web Development (Advance)", "Devops", "Web3"];
  const [selectedCategory, setSelectedCategory] = useRecoilState(category);
  return (
    <div className="flex justify-evenly">
      {categories.map((category) => (
        <Button
          key={category}
          variant="ghost"
          onClick={() => handleFilterButton(category)}
          className={selectedCategory == category ? "bg-gray-100 dark:bg-slate-700" : ""}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
