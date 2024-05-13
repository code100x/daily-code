import { Input, Label } from "@repo/ui";
import { useRecoilState } from "recoil";
import { problemStatementId } from "@repo/store";
export default function FormHeader() {
  const [LproblemStatementId, setProblemStatementId] = useRecoilState<string>(problemStatementId);

  return (
    <div>
      <Label htmlFor="problem-id">Id:</Label>
      <Input id={"problem-id"} value={LproblemStatementId} onChange={(e) => setProblemStatementId(e.target.value)} />
    </div>
  );
}
