"use client";
import { category } from "@repo/store";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useMemo } from "react";
import { useRecoilState } from "recoil";

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

  const [visibleCategories, hiddenCategories] = useMemo(() => {
    const visible = categories.slice(0, 5);
    const hidden = categories.slice(5);
    return [visible, hidden];
  }, [categories]);

  return (
    <div>
      <div className="xl:hidden block">
        <SelectCategory
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
      <div className="xl:block hidden">
        <div className="flex justify-evenly mx-auto border-2 rounded-full py-1 w-2/3">
          <ButtonCategory
            categories={visibleCategories}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
          />
          <DropDownCategory
            categories={hiddenCategories}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
          />
        </div>
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
    <>
      <div>
        <Button variant="ghost" onClick={() => handleCategoryChange("All")}>
          All
        </Button>
      </div>
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
    </>
  );
};

const DropDownCategory = ({ categories, selectedCategory, handleCategoryChange }: CategoryProps) => {
  return (
    <>
      {categories.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full">
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>More Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.category}
                onClick={() => handleCategoryChange(category.category)}
                className={selectedCategory === category.category ? "bg-gray-300 dark:bg-slate-700" : ""}
              >
                {category.category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
