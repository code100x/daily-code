"use client";
import { useRecoilState } from "recoil";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shad/ui/dropdown-menu";
import { categories as stateCategories } from "@repo/store";
import { Button } from "./shad/ui/button";
import { useEffect, useState } from "react";

interface Category {
  category: string;
}

interface CategoryProps {
  categories: Category[];
  selectedCategories: string[];
  handleCategoryChange: (category: string) => void;
}

interface CategoryStates {
  [key: string]: boolean;
}

export const Categories = ({ categories }: { categories: Category[] }) => {
  const [selectedCategories, setSelectedCategories] = useRecoilState<string[]>(stateCategories);

  const handleCategoryChange = (category: string) => {
    const index = selectedCategories.indexOf(category);
    if (index === -1) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    }
  };

  return (
    <div>
      <div className=" xl:hidden block ">
        <SelectCategory
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
      <div className="xl:block hidden">
        <ButtonCategory
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
    </div>
  );
};

const SelectCategory = ({ categories, selectedCategories, handleCategoryChange }: CategoryProps) => {
  const [categoryStates, setCategoryStates] = useState<CategoryStates>({});

  useEffect(() => {
    const initialCategoryStates = categories.reduce((acc: CategoryStates, category) => {
      acc[category.category] = selectedCategories.includes(category.category);
      return acc;
    }, {});
    setCategoryStates(initialCategoryStates);
  }, [categories, selectedCategories]);

  const handleCheckboxChange = (category: string, checked: boolean) => {
    setCategoryStates((prevState) => ({
      ...prevState,
      [category]: checked,
    }));
    handleCategoryChange(category);
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Filters</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category.category}
              checked={categoryStates[category.category] || false}
              onCheckedChange={(checked) => handleCheckboxChange(category.category, checked)}
            >
              {category.category}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ButtonCategory = ({ categories, selectedCategories, handleCategoryChange }: CategoryProps) => {
  return (
    <div className="flex justify-evenly mx-auto border-2 rounded-full py-1 w-2/3">
      {categories.map((category) => (
        <Button
          key={category.category}
          variant="ghost"
          onClick={() => handleCategoryChange(category.category)}
          className={
            selectedCategories.includes(category.category)
              ? "bg-gray-300 dark:bg-slate-700 rounded-full"
              : "rounded-full"
          }
        >
          {category.category}
        </Button>
      ))}
    </div>
  );
};
