import { useRecoilState } from "recoil";
import { argumentNames } from "@repo/store";
import { Label } from "../../../shad/ui/label";
import { Input } from "../../../shad/ui/input";
import { Dispatch, SetStateAction } from "react";

export default function ArgumentNamesInput() {
  const [LargumentNames, setArgumentNames]: [string[], Dispatch<SetStateAction<string[]>>] =
    useRecoilState(argumentNames);

  return (
    <div>
      <Label className="text-xl">Arguments:</Label>
      <Input
        value={LargumentNames.join("|")}
        onChange={(e) => {
          setArgumentNames(e.target.value.split("|"));
        }}
      />
    </div>
  );
}
