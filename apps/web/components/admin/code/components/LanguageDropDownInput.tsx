import { Label } from "@repo/ui";
import MultipleOptionChip from "../../../MultipleOptionChip";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalLanguagesSupported, languagesSupported } from "@repo/store";
import { CodeLanguage } from "@prisma/client";

export default function LanguageDropDownInput() {
  const [LlanguagesSupported, setLanguagesSupported] = useRecoilState<CodeLanguage[]>(languagesSupported);
  const LglobalLanguagesSupported = useRecoilValue<CodeLanguage[]>(globalLanguagesSupported);

  return (
    <div>
      <Label>
        {LlanguagesSupported.map((lang: CodeLanguage) => {
          return <MultipleOptionChip value={lang.value} key={lang.value} />;
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
              checked={LlanguagesSupported.map(({ id }) => id).includes(lang.id)}
              onCheckedChange={() => {
                if (LlanguagesSupported.map(({ id }) => id).includes(lang.id)) {
                  const newArr: CodeLanguage[] = LlanguagesSupported.filter(
                    (language) => language.value !== lang.value
                  );
                  setLanguagesSupported(newArr);
                } else {
                  setLanguagesSupported((prev) => [...prev, lang]);
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
