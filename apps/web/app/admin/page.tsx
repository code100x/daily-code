import { Admin } from "@repo/ui/pages";
import { AppbarClient } from "../../components/AppbarClient";

export default function () {
  return (
    <>
      <AppbarClient tracks={[]} />
      <Admin />
    </>
  );
}
