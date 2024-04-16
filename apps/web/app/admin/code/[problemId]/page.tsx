import db from "@repo/db/client";
import { AddProblemStatementForm } from "../../../../components/AddProblemStatementForm";

import { AppbarClient } from "../../../../components/AppbarClient";

export default async function AddProblemStatementPage({ params: { problemId } }: { params: { problemId: string } }) {
  const problemInfo = await db.problem.findUnique({
    where: { id: problemId },
  });

  const allLanguages = await db.codeLanguage.findMany();

  if (!problemInfo) {
    return <h1 className="text-2xl font-bold">Could not find the problem</h1>;
  }

  if (!allLanguages) {
    return <h1 className="text-2xl font-bold">No Language Support Available</h1>;
  }

  return (
    <>
      <AppbarClient tracks={[]} />
      <div className="w-2/3 mx-auto my-20">
        <AddProblemStatementForm languages={allLanguages} problem={problemInfo} />
      </div>
    </>
  );
}
