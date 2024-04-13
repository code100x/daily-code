"use client";
import { Button } from "./shad/ui/button";
import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useRecoilState } from "recoil";
import { category } from "@repo/store";
import { useState } from "react";

export const Categories = ({ categories }: { categories: { category: string }[] }) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  function handleFilterButton(category: string) {
    if (category == selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  }
  const [selectedCategory, setSelectedCategory] = useRecoilState(category);
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  return (
    <div className="relative">
      <div className="justify-evenly mx-auto border-2 rounded-full py-1 overflow-hidden w-2/3 hidden sm:hidden md:grid md:grid-cols-2 lg:flex">
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

      <div className="justify-evenly mx-auto border-2 rounded-full py-1 overflow-hidden w-2/3 flex items-center md:hidden">
        <Button onClick={toggleDropDown} variant="ghost">
          {selectedCategory == "" ? "Learnings" : selectedCategory}
          {showDropDown ? (
            <ChevronUpIcon className="h-[1.2rem] w-[1.2rem] ms-3" />
          ) : (
            <ChevronDownIcon className="h-[1.2rem] w-[1.2rem] ms-3" />
          )}
        </Button>
      </div>

      {showDropDown && (
        <div className="justify-evenly mx-auto border-2 rounded-xl py-1 overflow-hidden w-2/3 flex items-center md:hidden">
          <ul className="py-2 hover:text-accent-foreground">
            {categories.map((category) => (
              <li key={category.category}>
                <Button
                  onClick={() => {
                    handleFilterButton(category.category), setShowDropDown(false);
                  }}
                  className={selectedCategory == category.category ? "bg-gray-100 dark:bg-slate-700" : ""}
                  variant="ghost"
                >
                  {category.category}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
