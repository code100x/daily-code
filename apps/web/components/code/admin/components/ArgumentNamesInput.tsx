import { useRecoilState } from "recoil";
import { argumentNames } from "@repo/store";
import { Label, Input } from "@repo/ui";

export default function ArgumentNamesInput() {
  const [LargumentNames, setArgumentNames] = useRecoilState<string[]>(argumentNames);

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
