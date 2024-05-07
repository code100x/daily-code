import { Landing } from "../screens/Landing";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function Page(): Promise<JSX.Element> {

  return (
    <main>
      <Landing />
    </main>
  );
}