import { Editor } from "@monaco-editor/react";
import { Clock4, Cpu } from "lucide-react";

const AcceptedSubmissionResult = ({ submissionResult }: { submissionResult: any }) => {
  const { statusDesc, createdAt, runtime, memoryUsage, language, code } = submissionResult;

  return (
    <div className="p-4">
      <div className="font-bold text-xl text-[#0E902A]">{statusDesc}</div>
      <div className="text-[#CCC] text-sm mt-1">
        submitted at{" "}
        {new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(createdAt))}
      </div>
      <div className="my-4 flex items-center w-full gap-4">
        <div className="flex-1 flex flex-col gap-2 bg-gray-600 p-4 rounded-md">
          <div className="flex items-center gap-1">
            <Clock4 size={16} />
            <span>Runtime</span>
          </div>

          <div>
            <span className="font-bold text-lg">{runtime}</span>
            &nbsp;
            <span>ms</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 bg-gray-600 p-4 rounded-md">
          <div className="flex items-center gap-1">
            <Cpu size={16} />

            <span>Memory</span>
          </div>
          <div>
            <span className="font-bold text-lg">{Math.floor(memoryUsage / 1000)}</span>
            &nbsp;
            <span>mb</span>
          </div>
        </div>
      </div>
      <div className="my-8">
        <h3>Code | {language.label}</h3>
        <div className="rounded-md overflow-hidden bg-[#1E1E1E] py-4 my-4 h-[300px]">
          <Editor
            height={"100%"}
            value={atob(code)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              lineNumbers: "off",
              readOnly: true,
              scrollBeyondLastLine: false,
            }}
            language={language.value}
          />
        </div>
      </div>
    </div>
  );
};

export default AcceptedSubmissionResult;
