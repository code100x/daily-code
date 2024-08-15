"use client";
import { useRecoilState } from "recoil";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
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
      <div className="flex gap-2 items-center w-full justify-end">
        <span className="font-medium">Filter by:</span>
        <SelectCategory
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
