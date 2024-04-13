"use client";
import { Button } from "./shad/ui/button";
import { useRecoilState } from "recoil";
import { category } from "@repo/store";
import { cn } from "../lib/utils";

export const Categories = ({ categories }: { categories: { category: string }[] }) => {
  function handleFilterButton(category: string) {
    if (category == selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  }
  const [selectedCategory, setSelectedCategory] = useRecoilState(category);
  return (
    <div className="flex justify-evenly mx-auto border-2 rounded-full py-1 w-2/3  overflow-auto scroll-smooth no-scrollbar">
      {categories.map((category) => (
        <Button
          key={category.category}
          variant="ghost"
          onClick={() => handleFilterButton(category.category)}
          className={cn("mx-1", {
            "bg-gray-100 dark:bg-slate-700": selectedCategory == category.category,
          })}
        >
          {category.category}
        </Button>
      ))}
    </div>
  );
};
