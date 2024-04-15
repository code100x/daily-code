import { codeSubmitLoadingState } from "@repo/store";
import { useRecoilValue } from "recoil";
import { Button } from "../shad/ui/button";
import { CodeLanguage, ProblemStatement, TestCase } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import CodeTestButton from "./CodeTestButton";
import CodeSubmitButton from "./CodeSubmitButton";

export const Codebar = ({
  problemStatement,
}: {
  problemStatement: ProblemStatement & {
    languagesSupported: CodeLanguage[];
    testCases: TestCase[];
  };
}) => {
  const codeSubmitLoading = useRecoilValue(codeSubmitLoadingState);
  return (
    <>
      {codeSubmitLoading ? (
        <Button variant="outline" className="text-green-500 px-10 animate-pulse">
          <LoaderCircle className="animate-spin mr-3 text-[#CCC]" size={16} />
          Pending
        </Button>
      ) : (
        <>
          <CodeTestButton problemStatement={problemStatement} />
          <CodeSubmitButton problemStatement={problemStatement} />
        </>
      )}
    </>
  );
};
