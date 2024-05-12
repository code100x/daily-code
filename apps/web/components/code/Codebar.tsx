import { codeSubmitLoadingState } from "@repo/store";
import { useRecoilValue } from "recoil";
import { Button } from "@repo/ui/shad/ui";
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
    <div className="mr-4 w-40">
      {codeSubmitLoading ? (
        <Button variant={"secondary"} size={"sm"} className="text-green-500 px-10 animate-pulse">
          <LoaderCircle className="animate-spin mr-3 text-[#CCC]" size={16} />
          Pending
        </Button>
      ) : (
        <div className="flex justify-center content-center flex-1 gap-2 mr-4">
          <CodeTestButton problemStatement={problemStatement} />
          <CodeSubmitButton problemStatement={problemStatement} />
        </div>
      )}
    </div>
  );
};
