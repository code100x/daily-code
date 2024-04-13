"use client";
import { Button } from "./shad/ui/button";
import { useRecoilState } from "recoil";
import { category } from "@repo/store";

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
    <div className="relative w-full ">
      <div className="flex justify-evenly overflow-x-auto overflow-hidden w-[95%] md:px-2 px-0 mx-auto border-2 rounded-full py-1 md:w-2/3">
        {categories.map((category) => (
          <Button
            key={category.category}
            style={{ borderRadius: "2rem" }}
            variant="ghost"
            onClick={() => handleFilterButton(category.category)}
            className={selectedCategory == category.category ? "bg-gray-100 dark:bg-slate-700" : ""}
          >
            {category.category}
          </Button>
        ))}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-chevrons-right block md:hidden absolute right-6 animate-ping top-2.5 opacity-70"
      >
        <path d="m6 17 5-5-5-5" />
        <path d="m13 17 5-5-5-5" />
      </svg>
    </div>
  );
};
