interface RunCodeOutputProps {
  error: boolean;
  output: any;
}

export const RunCodeOutput = ({ error, output }: RunCodeOutputProps) => {
  return <div className="flex p-2">{output}</div>;
};
