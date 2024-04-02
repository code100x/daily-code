export const RunCodeOutput = ({ error, output }: { error: any; output: any }) => {
  return <div className="flex p-2">{output}</div>;
};
