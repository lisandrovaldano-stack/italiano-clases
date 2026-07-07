import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

const LEVEL_LABEL: Record<string, string> = {
  A1: "Inicial",
  A2: "Básico",
  B1: "Intermedio",
  B2: "Intermedio alto",
  C1: "Avanzado",
  C2: "Avanzado superior",
};

export default async function CursoPublicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (!course) notFound();

  const { user, profile } = await getCurrentProfile();

  let isEnrolled = false;
  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("course_id", id)
      .eq("student_id", user.id)
      .maybeSingle();
    isEnrolled = !!enrollment;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <Link href="/cursos" className="text-sm font-semibold text-primary">
        ← Volver a cursos
      </Link>

      <div className="rounded-3xl border border-border p-8">
        <span className="inline-block rounded-full bg-primary-light px-4 py-1 text-sm font-semibold text-primary">
          {course.level} · {LEVEL_LABEL[course.level]}
        </span>
        <h1 className="mt-4 text-3xl font-black">{course.title}</h1>
        {course.description && (
          <p className="mt-3 text-foreground/80">{course.description}</p>
        )}
        {course.schedule_text && (
          <p className="mt-4 text-sm text-foreground/70">
            🗓️ {course.schedule_text}
          </p>
        )}

        <div className="mt-8">
          {isEnrolled ? (
            <Link
              href={`/dashboard/curso/${course.id}`}
              className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Ver mi bitácora →
            </Link>
          ) : profile ? (
            <p className="text-sm text-foreground/60">
              Todavía no estás inscripto en este curso. Hablá con María
              Verónica para que te agregue. 🙂
            </p>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/signup"
                className="inline-block rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-cream-dark"
              >
                Crear cuenta
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
