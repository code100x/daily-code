import { Admin } from "@repo/ui/pages";
import { AppbarClient } from "../../components/AppbarClient";

export default function AdminPage() {
  return (
    <>
      <AppbarClient tracks={[]} />
      <Admin />
    </>
  );
}
