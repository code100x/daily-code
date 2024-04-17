import { mainFuncName } from "@repo/store";
import { Input } from "../../../shad/ui/input";
import { Label } from "../../../shad/ui/label";
import { useRecoilState } from "recoil";
import { Dispatch, SetStateAction } from "react";

export default function MainFunctionInput() {
  const [LmainFuncName, setMainFuncName]: [string, Dispatch<SetStateAction<string>>] = useRecoilState(mainFuncName);
  return (
    <div>
      <Label className="m-1">MainFunction:</Label>
      <Input value={LmainFuncName} onChange={(e) => setMainFuncName(e.target.value)} />
    </div>
  );
}
