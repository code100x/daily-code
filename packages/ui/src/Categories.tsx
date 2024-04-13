"use client";
import { useRecoilState } from "recoil";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shad/ui/select";
import { category } from "@repo/store";

export const Categories = ({ categories }: { categories: { category: string }[] }) => {
  const [selectedCategory, setSelectedCategory] = useRecoilState(category);

  function handleCategoryChange(category: string) {
    if (category == selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  }

  return (
    <div className="flex justify-evenly mx-auto">
      <Select
        onValueChange={(e) => {
          handleCategoryChange(e);
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder={selectedCategory || "All Categories"}></SelectValue>
        </SelectTrigger>
        <SelectContent>
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
