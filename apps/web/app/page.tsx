import { getServerSession } from "next-auth";
import { Landing } from "../screens/Landing";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function Page(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/auth");
  }

  return (
    <main>
      <Landing />
    </main>
  );
}
