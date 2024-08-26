"use client";
import { useRecoilState } from "recoil";
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { category } from "@repo/store";

interface Category {
  category: string;
}

interface CategoryProps {
  categories: Category[];
  selectedCategory: string;
  handleCategoryChange: (category: string) => void;
}

export const Categories = ({ categories }: { categories: Category[] }) => {
  const [selectedCategory, setSelectedCategory] = useRecoilState(category);

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory || category === "All") {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div>
      <div className="2.5xl:hidden block">
        <SelectCategory
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
      <div className="2.5xl:block hidden">
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
        onValueChange={(e) => {
          handleCategoryChange(e);
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder={selectedCategory || "All"}></SelectValue>
        </SelectTrigger>
        <SelectContent
          ref={(ref) => {
            if (!ref) return;
            ref.ontouchstart = (e) => {
              e.preventDefault();
            };
          }}
        >
          <SelectItem value="All">All</SelectItem>
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
        <Button variant="ghost" className="rounded-full" onClick={() => handleCategoryChange("All")}>
          All
        </Button>
      {categories.map((category) => (
        <Button
          key={category.category}
          variant="ghost"
          onClick={() => handleCategoryChange(category.category)}
          className={
            selectedCategory === category.category ? "bg-gray-300 dark:bg-slate-700 rounded-full" : "rounded-full"
          }
        >
          {category.category}
        </Button>
      ))}
    </div>
  );
};
