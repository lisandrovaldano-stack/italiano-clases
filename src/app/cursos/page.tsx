import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/CourseCard";
import { StatPill } from "@/components/StatPill";
import { LevelFilter } from "@/components/LevelFilter";
import { HeroCarousel } from "@/components/HeroCarousel";
import type { Course, Level } from "@/lib/database.types";

export default async function CursosPage({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const courses = (data ?? []) as Course[];
  const levels: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const counts: Record<string, number> = { Todos: courses.length };
  for (const level of levels) {
    counts[level] = courses.filter((c) => c.level === level).length;
  }

  const visible = nivel ? courses.filter((c) => c.level === nivel) : courses;
  const activeCount = courses.filter((c) => c.is_active).length;
  const levelCount = new Set(courses.map((c) => c.level)).size;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <div className="relative overflow-hidden rounded-3xl p-8 text-white">
        <HeroCarousel />
        <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-semibold">
          <span className="mr-2 italic opacity-80">corso</span>
          Cursos de italiano
        </span>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h1 className="text-3xl font-black md:text-4xl">
              Aprendé italiano con Verónica 🇮🇹
            </h1>
            <p className="mt-3 text-white/90">
              Conocé las clases de italiano de María Verónica Salinas. Iniciá
              sesión para ver tu progreso, o esperá a que te inscriba en un
              curso. ✨
            </p>
          </div>
          <div className="flex gap-3">
            <StatPill value={courses.length} it="totale" es="Total" />
            <StatPill value={activeCount} it="attivi" es="Activos" />
            <StatPill value={levelCount} it="livelli" es="Niveles" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-foreground/60">
          Filtrá por nivel
        </p>
        <LevelFilter counts={{ ...counts, Todos: courses.length } as never} />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-foreground/60">
          Todavía no hay cursos cargados para este nivel.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <CourseCard key={course.id} course={course} href={`/cursos/${course.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
