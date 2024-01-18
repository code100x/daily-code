import { Landing } from "../screens/Landing";
import { app } from "@repo/common";
import { httpsCallable } from 'firebase/functions';
import { functions } from "@repo/common";
import { AppbarClient } from "../components/AppbarClient";

async function getTodos() {
    const getTrancksFn = httpsCallable(functions, 'leetcode-clone-c39eb/us-central1/getTracks');
    const todos = await getTrancksFn();
    console.log(todos);
    return todos.todos || [];
}


export default async function Page(): Promise<JSX.Element> {
  const todos = await getTodos()
  
  return (
    <main>
      <Landing />
    </main>
  );
}
