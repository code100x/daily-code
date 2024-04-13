"use client";

import { useRecoilState } from "recoil";
import { category } from "@repo/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./shad/ui/tabs";

export const Categories = ({ categories }: { categories: { category: string }[] }) => {
  function handleFilterButton(category: string) {
    if (category == "all") {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  }
  const [_, setSelectedCategory] = useRecoilState(category);
  return (
    <div className="px-4 max-sm:px-2 flex justify-center items-center ">
      <Tabs
        defaultValue="all"
        className="max-w-full  overflow-x-auto  "
        onValueChange={(selectedValue) => handleFilterButton(selectedValue)}
      >
        <TabsList className="py-6 max-sm:py-2">
          <TabsTrigger value="all" className="text-lg max-sm:text-sm">
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger value={category.category} className="text-lg max-sm:text-sm">
              {category.category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
