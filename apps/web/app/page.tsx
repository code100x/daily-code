import { Landing } from "../screens/Landing";

export default async function Page(): Promise<JSX.Element> {
  return (
    <main>
      <Landing />
    </main>
  );
}

// re validates landing page tracks cached stored every hour
export const revalidate = 3600;
