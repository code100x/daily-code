"use client";
import { useRecoilState } from "recoil";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";
import { category } from "@repo/store";
import { Button } from "./shad/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import useCategorySearchParams from "./hooks/useCategorySearchParams";

interface Category {
  category: string;
}

interface CategoryProps {
  categories: Category[];
  selectedCategory: string;
  handleCategoryChange: (category: string) => void;
}

export const Categories = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const selectedCategory = useCategorySearchParams() ?? "";

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) {
      router.push("/");
    } else {
      router.push(`/?category=${category}`);
    }
  };

  return (
    <div>
      <div className=" xl:hidden block ">
        <SelectCategory
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
      <div className="xl:block hidden">
        <ButtonCategory
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
    </div>
  );
};

const SelectCategory = ({ categories, selectedCategory, handleCategoryChange }: CategoryProps) => {
  return (
    <div className="flex justify-center">
      <Select
        value={selectedCategory}
        onValueChange={(e) => {
          handleCategoryChange(e);
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder={"All Categories"}></SelectValue>
        </SelectTrigger>
        <SelectContent
          ref={(ref) => {
            if (!ref) return;
            ref.ontouchstart = (e) => {
              e.preventDefault();
            };
          }}
        >
          {categories.map((category) => (
            <SelectItem value={category.category} key={category.category}>
              {category.category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const ButtonCategory = ({ categories, selectedCategory, handleCategoryChange }: CategoryProps) => {
  return (
    <div className="flex justify-evenly mx-auto border-2 rounded-full py-1 w-2/3">
      {categories.map((category) => (
        <Button
          key={category.category}
          variant="ghost"
          onClick={() => handleCategoryChange(category.category)}
          className={
            selectedCategory == category.category ? "bg-gray-300 dark:bg-slate-700 rounded-full" : "rounded-full"
          }
        >
          {category.category}
        </Button>
      ))}
    </div>
  );
};
