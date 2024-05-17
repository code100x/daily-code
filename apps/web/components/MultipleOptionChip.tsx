export default function MultipleOptionChip({ value }: { value: string }) {
  return (
    <div className="inline-flex align-middle px-3 py-1 bg-muted rounded-full m-1">
      <div className="">{value}</div>
    </div>
  );
}
