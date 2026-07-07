"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function LevelFilter({
  counts,
}: {
  counts: Record<string, number> & { Todos: number };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("nivel") ?? "Todos";

  function select(level: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (level === "Todos") params.delete("nivel");
    else params.set("nivel", level);
    router.push(`/cursos?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(counts).map(([level, count]) => (
        <button
          key={level}
          onClick={() => select(level)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === level
              ? "bg-primary text-white"
              : "bg-cream-dark text-foreground/70 hover:bg-primary-light"
          }`}
        >
          {level}
          <span
            className={`rounded-full px-2 text-xs ${
              active === level ? "bg-white/20" : "bg-white"
            }`}
          >
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}
