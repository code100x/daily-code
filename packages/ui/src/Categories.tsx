"use client";
import { Button } from "./shad/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./shad/ui/popover";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useRecoilState } from "recoil";
import { category } from "@repo/store";
import { useState } from "react";

export const Categories = ({ categories }: { categories: { category: string }[] }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useRecoilState(category);
  function handleFilterButton(category: string) {
    if (category == selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
    setPopoverOpen(false);
  }

  return (
    // <div className="flex justify-evenly mx-auto border-2 rounded-full py-1 w-2/3">
    //   {categories.map((category) => (
    //     <Button
    //       key={category.category}
    //       variant="ghost"
    //       onClick={() => handleFilterButton(category.category)}
    //       className={selectedCategory == category.category ? "bg-gray-100 dark:bg-slate-700" : ""}
    //     >
    //       {category.category}
    //     </Button>
    //   ))}
    // </div>

    <div className="flex relative mx-auto sm:mx-1 w-fit items-center py-2 px-2 sm:h-[initial] sm:py-2">
      <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
        <PopoverTrigger className="flex items-center justify-center mt-1">
          <button onClick={() => setPopoverOpen(!popoverOpen)} className="text-gray-100 dark:text-gray-100">
            {popoverOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
          </button>
        </PopoverTrigger>
        <PopoverContent className="mt-4">
          <ul className="flex-col flex-wrap bg-slate-900 rounded-xl items-center justify-evenly gap-y-1 sm:w-[initial] sm:flex-nowrap sm:gap-5">
            {categories.map((category) => (
              <li className="mx-2 flex h-3/4 items-center justify-center relative" key={category.category}>
                <Button
                  key={category.category}
                  variant="ghost"
                  className={`my-1 ${selectedCategory == category.category ? `bg-gray-50 text-cyan-400 dark:bg-slate-600 rounded-xl` : "hover:rounded-xl hover:bg-slate-800"}`}
                  onClick={() => {
                    handleFilterButton(category.category);
                  }}
                >
                  {category.category}
                </Button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};
