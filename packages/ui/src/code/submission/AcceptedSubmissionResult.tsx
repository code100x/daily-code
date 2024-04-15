import { Clock4, Cpu } from "lucide-react";
import SubmissionCreatedAt from "./SubmissionCreatedAt";
import { ReactNode } from "react";
import { activeSubmissionResultSelector } from "@repo/store";
import { useRecoilValue } from "recoil";

const SubmissionStats = ({
  icon,
  label,
  measurement,
  value,
}: {
  icon: ReactNode;
  label: string;
  measurement: string;
  value: string;
}) => {
  return (
    <div className="flex-1 flex flex-col gap-2 bg-gray-600 p-4 rounded-md">
      <div className="flex items-center gap-1">
        {icon}
        <span>{label}</span>
      </div>
      <div>
        <span className="font-bold text-lg">{value}</span>
        &nbsp;
        <span>{measurement}</span>
      </div>
    </div>
  );
};

const AcceptedSubmissionResult = () => {
  const submissionDetails = useRecoilValue(activeSubmissionResultSelector);
  const { statusDesc, createdAt, runtime, memoryUsage } = submissionDetails;

  const stats = [
    {
      icon: <Clock4 size={16} />,
      label: "Runtime",
      measurement: "ms",
      value: runtime,
    },
    {
      icon: <Cpu size={16} />,
      label: "Memory",
      measurement: "mb",
      value: Math.floor(memoryUsage / 1024),
    },
  ];

  return (
    <div className="p-4">
      <div className="font-bold text-xl text-[#0E902A]">{statusDesc}</div>
      <SubmissionCreatedAt createdAt={createdAt} />
      <div className="my-4 flex items-center w-full gap-4">
        {stats.map((stat) => (
          <SubmissionStats key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default AcceptedSubmissionResult;
