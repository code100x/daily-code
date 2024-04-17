import { Label } from "@radix-ui/react-label";
import MultipleOptionChip from "../../../MultipleOptionChip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../shad/ui/dropdown-menu";
import { Button } from "../../..";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalLanguagesSupported, languagesSupported } from "@repo/store";
import { Dispatch, SetStateAction } from "react";
import { CodeLanguage } from "prisma/prisma-client";

export default function LanguageDropDownInput() {
  const [LlanguagesSupported, setLanguagesSupported]: [string[], Dispatch<SetStateAction<string[]>>] =
    useRecoilState(languagesSupported);
  const LglobalLanguagesSupported: CodeLanguage[] = useRecoilValue(globalLanguagesSupported);
  return (
    <div>
      <Label>
        {LlanguagesSupported.map((lang) => {
          return <MultipleOptionChip value={lang} key={lang} />;
        })}
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-full px-3">
            Add
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Languages</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LglobalLanguagesSupported.map((lang: CodeLanguage) => (
            <DropdownMenuCheckboxItem
              key={lang.value.toString() + "option"}
              checked={LlanguagesSupported.includes(lang.value)}
              onCheckedChange={() => {
                if (LlanguagesSupported.includes(lang.value)) {
                  const newArr: string[] = LlanguagesSupported.filter((language) => language !== lang.value);
                  setLanguagesSupported(newArr);
                } else {
                  setLanguagesSupported((prev) => [...prev, lang.value]);
                }
              }}
            >
              {lang.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
