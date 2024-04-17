import { useRecoilState } from "recoil";
import { argumentNames } from "@repo/store";
import { Label } from "../../../shad/ui/label";
import { Input } from "../../../shad/ui/input";

export default function ArgumentNamesInput() {
  const [LargumentNames, setArgumentNames] = useRecoilState(argumentNames);
  return (
    <div>
      <Label className="text-xl">Arguments:</Label>
      <Input
        value={LargumentNames.join("|")}
        onChange={(e) => {
          setArgumentNames((prev) => e.target.value.split("|"));
        }}
      />
    </div>
  );
}
