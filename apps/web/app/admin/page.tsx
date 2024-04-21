import { Admin } from "@repo/ui/pages";
import { AppbarClient } from "../../components/AppbarClient";

export default async function AdminPage() {
  return (
    <>
      <AppbarClient tracks={[]} />
      <Admin />
    </>
  );
}