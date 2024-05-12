const SubmissionCreatedAt = ({ createdAt }: { createdAt: Date }) => {
  return (
    <div className="text-xs mt-2">
      submitted at{" "}
      {new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(createdAt))}
    </div>
  );
};

export default SubmissionCreatedAt;
