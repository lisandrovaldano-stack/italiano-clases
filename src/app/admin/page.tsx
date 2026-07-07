import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { createCourse } from "./actions";
import type { Course, Level } from "@/lib/database.types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default async function AdminPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile) redirect("/login");
  if (profile.role !== "teacher") redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });
  const courses = (data ?? []) as Course[];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <div>
        <span className="text-xs font-semibold italic text-primary/70">
          pannello
        </span>
        <h1 className="text-3xl font-black">Panel de la profesora</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Creá cursos, cargá encuentros y llevá la asistencia de tus alumnos.
        </p>
      </div>

      <details className="rounded-3xl border border-border p-6">
        <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide">
          + Nuevo curso
        </summary>
        <form action={createCourse} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Título</label>
            <input
              name="title"
              required
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
              placeholder="Italiano principiantes - Sábados"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Nivel</label>
            <select
              name="level"
              required
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Horario</label>
            <input
              name="schedule_text"
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
              placeholder="Sábados de 17 a 18 hs"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Fecha de inicio</label>
            <input
              type="date"
              name="start_date"
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Fecha de fin</label>
            <input
              type="date"
              name="end_date"
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Descripción</label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark sm:col-span-2"
          >
            Crear curso
          </button>
        </form>
      </details>

      <div className="space-y-3">
        {courses.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-foreground/60">
            Todavía no creaste ningún curso.
          </p>
        ) : (
          courses.map((course) => (
            <Link
              key={course.id}
              href={`/admin/curso/${course.id}`}
              className="flex items-center justify-between rounded-2xl border border-border p-5 hover:bg-cream-dark"
            >
              <div>
                <p className="font-bold">{course.title}</p>
                <p className="text-sm text-foreground/60">
                  {course.level} · {course.schedule_text ?? "Sin horario"}
                </p>
              </div>
              <span className="text-primary">Gestionar →</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
