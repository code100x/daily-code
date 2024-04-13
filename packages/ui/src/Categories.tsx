"use client";
import { Button } from "./shad/ui/button";
import { useRecoilState } from "recoil";
import { category } from "@repo/store";
import { DropdownMenu, DropdownMenuItem } from "./shad/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

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
    <div className="flex justify-center items-center">
      <div className="flex  border-2 dark:border-slate-700 text-bg-slate-700 rounded-full py-2 px-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:ring-0">{selectedCategory || "Select Category"}</DropdownMenuTrigger>

          <DropdownMenuContent className="bg-background p-2 border-2 focus:ring-0 dark:border-slate-700 rounded-xl flex flex-col  items-center">
            {categories.map((category) => (
              <DropdownMenuItem
                onClick={() => handleFilterButton(category.category)}
                className={
                  selectedCategory == category.category
                    ? "bg-gray-100 flex justify-center focus:ring-0 dark:bg-slate-700 w-full  font-bold font-2xl"
                    : "font-semibold  py-2 w-full flex justify-center focus:ring-0"
                }
              >
                {category.category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
