import Link from "next/link";
import type { Course } from "@/lib/database.types";

const LEVEL_LABEL: Record<string, string> = {
  A1: "Inicial",
  A2: "Básico",
  B1: "Intermedio",
  B2: "Intermedio alto",
  C1: "Avanzado",
  C2: "Avanzado superior",
};

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CourseCard({
  course,
  href,
}: {
  course: Course;
  href: string;
}) {
  const dateRange =
    course.start_date || course.end_date
      ? `${formatDate(course.start_date) ?? "—"} – ${
          formatDate(course.end_date) ?? "—"
        }`
      : "Sin fechas";

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-2xl border border-border bg-background transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-32 flex-col items-center justify-center gap-1 bg-gradient-to-br from-primary-light to-cream-dark">
        <span className="text-2xl font-black text-primary">ITALIANO</span>
        <span className="text-xs font-semibold tracking-wide text-primary/70">
          {course.level} · {LEVEL_LABEL[course.level]}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-bold">{course.title}</h3>
        {course.schedule_text && (
          <p className="text-sm text-foreground/70">{course.schedule_text}</p>
        )}
        <p className="flex items-center gap-1 text-xs text-foreground/60">
          📅 {dateRange}
        </p>
      </div>
    </Link>
  );
}
