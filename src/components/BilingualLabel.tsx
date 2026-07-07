export function BilingualLabel({
  it,
  es,
  className = "",
}: {
  it: string;
  es: string;
  className?: string;
}) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="text-[10px] font-medium uppercase tracking-wide text-primary/70 italic">
        {it}
      </span>
      <span>{es}</span>
    </span>
  );
}
