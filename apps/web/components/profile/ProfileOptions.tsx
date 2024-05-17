"use client";
import { Braces, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileOptions = () => {
  const optionsData = [
    {
      name: "Profile",
      icon: <UserRound color="#3b82f6" size={18} />,
      href: "/profile",
    },
    {
      name: "Submissions",
      icon: <Braces color="#3b82f6" size={18} />,
      href: "/profile/submissions",
    },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const [activeOption, setActiveOption] = useState<Number | null>(() => {
    return pathname === "/profile" ? 0 : null;
  });

  useEffect(() => {
    const currentPath = pathname;
    const activeIndex = optionsData.findIndex((option) => option.href === currentPath);
    setActiveOption(activeIndex);
  }, [pathname, optionsData]);

  const handleOptionClick = (index: number, href: string) => {
    setActiveOption(index);
    router.push(href);
  };
  return (
    <div className="flex gap-2 flex-col px-2 !max-h-[80%] overflow-y-auto w-full">
      {optionsData.map((x, i) => {
        return (
          <div
            onClick={() => handleOptionClick(i, x.href)}
            className={` ${activeOption === i ? "border-r-8 border-blue-500 dark:bg-[#ffffff1d] bg-[#2020204d]" : ""}  cursor-pointer hover:bg-[#ffffff1f] flex items-center gap-2 rounded-md p-2 `}
            key={i}
          >
            <span>{x.icon}</span>
            <span>{x.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileOptions;
