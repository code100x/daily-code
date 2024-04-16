import EditProblemStatementCard from "./EditProblemStatementCard";
import { ScrollArea } from "./shad/ui/scroll-area";
import { ProblemStatement } from "@prisma/client";

export const ProblemStatements = async ({ problemStatements }: { problemStatements: ProblemStatement[] }) => {
  return (
    <div className="grid grid-cols-1 place-items-center">
      <ScrollArea className="m-2 w-2/3">
        <div className="space-y-4">
          {problemStatements.map((problemStatement, i) => (
            <EditProblemStatementCard key={i} problemStatement={problemStatement} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
