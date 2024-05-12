import { Input } from "@repo/ui/shad/ui";
import { useRecoilState } from "recoil";
import { problemStatementId } from "@repo/store";
import { Label } from "@repo/ui/shad/ui";

export default function FormHeader() {
  const [LproblemStatementId, setProblemStatementId] = useRecoilState<string>(problemStatementId);

  return (
    <div>
      <Label htmlFor="problem-id">Id:</Label>
      <Input id={"problem-id"} value={LproblemStatementId} onChange={(e) => setProblemStatementId(e.target.value)} />
    </div>
  );
}
