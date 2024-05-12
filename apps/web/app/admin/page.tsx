import { Admin } from "../../components/pages";
import { AppbarClient } from "../../components/AppbarClient";

export default async function AdminPage() {
  return (
    <>
      <AppbarClient tracks={[]} />
      <Admin />
    </>
  );
}