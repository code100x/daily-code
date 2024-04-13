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
      <div className="hidden lg:flex justify-evenly mx-auto border-2 rounded-full  py-1 w-2/3">
        {categories.map((category) => (
          <Button
            key={category.category}
            variant="ghost"
            onClick={() => handleFilterButton(category.category)}
            className={selectedCategory == category.category ? "bg-gray-100 dark:bg-slate-700" : ""}
          >
            {category.category}
          </Button>
        ))}
      </div>
      <div className="flex lg:hidden border-2 dark:border-slate-700 text-bg-slate-700 rounded-full py-1 px-3">
        <DropdownMenu>
          <DropdownMenuTrigger>Select Category</DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="bg-background p-2 border-2 dark:border-slate-700 rounded-xl flex flex-col  items-center">
              {categories.map((category) => (
                <DropdownMenuItem
                  onClick={() => handleFilterButton(category.category)}
                  className={
                    selectedCategory == category.category
                      ? "bg-gray-100 flex justify-center dark:bg-slate-700 w-full  font-bold font-2xl"
                      : "font-semibold  py-2"
                  }
                >
                  {category.category}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
