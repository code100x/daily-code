"use client";
import { Button } from "./shad/ui/button";
import { useRecoilState } from "recoil";
import { category } from "@repo/store";
import useWindowSize from "./hooks/useWindowSize";

export const Categories = ({ categories }: { categories: { category: string }[] }) => {
  function handleFilterButton(category: string) {
    if (category == selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  }
  const { windowWidth } = useWindowSize();

  const [selectedCategory, setSelectedCategory] = useRecoilState(category);
  return (
    <div className="flex justify-center px-4">
      {windowWidth > 640 ? (
        <div className="flex justify-evenly  border-2 rounded-full py-1 lg:w-2/3 md:w-full overflow-x-auto scroll-p-0 sm:mx-8">
          {categories.map((category) => (
            <Button
              key={category.category}
              variant="ghost"
              onClick={() => handleFilterButton(category.category)}
              className={selectedCategory == category.category ? "bg-gray-100 dark:bg-slate-700 z-0" : ""}
            >
              {category.category}
            </Button>
          ))}
        </div>
      ) : (
        <>
          <select
            className=" text-gray-900 text-sm rounded-full outline-none  focus:ring-slate-500 focus:border-slate-700 block w-full p-2.5 dark:bg-black  dark:border-gray-700 border-2 dark:placeholder-black dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterButton(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.category} value={category.category}>
                {category.category}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
