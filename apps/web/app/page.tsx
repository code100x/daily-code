import { Landing } from "../screens/Landing";

export const dynamic = "force-dynamic";

export default async function Page(): Promise<JSX.Element> {
  return (
    <main>
      <Landing />
    </main>
  );
}
