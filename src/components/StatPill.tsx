export function StatPill({
  value,
  it,
  es,
}: {
  value: number;
  it: string;
  es: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white/15 px-5 py-3 text-white">
      <span className="text-2xl font-black">{value}</span>
      <span className="text-[10px] italic opacity-80">{it}</span>
      <span className="text-xs font-bold uppercase tracking-wide">{es}</span>
    </div>
  );
}
