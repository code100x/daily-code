import { Braces, FlaskConical } from "lucide-react";
import ProblemSubmissionTable from "./ProblemSubmissionTable";

export async function ProfileStats({ problemStatements, stat }: { problemStatements: any; stat: string }) {
  return (
    <div>
      <header className="border-b-2 p-3">
        <div className="px-2 w-[70%]">
          <h1 className="text-lg lg:text-2xl flex items-center gap-2 font-semibold w-fit">
            {stat === "Submissions" ? (
              <Braces color="#3b82f6" /> 
            ) : (
              <FlaskConical color="#3b82f6" />
            )}
            <span>{stat}</span>
          </h1>
          <span className="text-xs leading-normal text-gray-400">
            This page shows you the accepted {stat} you have made so far
          </span>
        </div>
      </header>
      <ProblemSubmissionTable problemStatements={problemStatements} />
    </div>
  );
}
