import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { CourseCard } from "@/components/CourseCard";
import { StatPill } from "@/components/StatPill";
import type { Course } from "@/lib/database.types";

export default async function DashboardPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile) redirect("/login");
  if (profile.role === "teacher") redirect("/admin");

  const supabase = await createClient();
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("student_id", user.id);

  const courseIds = (enrollments ?? []).map((e) => e.course_id);
  let courses: Course[] = [];
  if (courseIds.length > 0) {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .in("id", courseIds);
    courses = (data ?? []) as Course[];
  }

  const levelCount = new Set(courses.map((c) => c.level)).size;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 text-white">
        <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-semibold">
          <span className="mr-2 italic opacity-80">corsi</span>
          Mis cursos
        </span>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h1 className="text-3xl font-black md:text-4xl">
              Bienvenido/a, {profile.full_name} 🇮🇹
            </h1>
            <p className="mt-3 text-white/90">
              Acá están los cursos en los que estás inscripto/a. Entrá a uno
              para ver tu bitácora de clases y asistencia. ✨
            </p>
          </div>
          <div className="flex gap-3">
            <StatPill value={courses.length} it="totale" es="Total" />
            <StatPill
              value={courses.filter((c) => c.is_active).length}
              it="attivi"
              es="Activos"
            />
            <StatPill value={levelCount} it="livelli" es="Niveles" />
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-foreground/60">
          Todavía no estás inscripto/a en ningún curso. Hablá con María
          Verónica para que te agregue. 🙂
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              href={`/dashboard/curso/${course.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
