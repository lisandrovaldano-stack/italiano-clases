import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { SessionRow } from "@/components/SessionRow";
import type { ClassSession, Material } from "@/lib/database.types";

export default async function BitacoraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile) redirect("/login");

  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", id)
    .eq("student_id", user.id)
    .maybeSingle();

  if (profile.role !== "teacher" && !enrollment) notFound();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (!course) notFound();

  const { data: sessions } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("course_id", id)
    .order("numero", { ascending: false });

  const { data: attendance } = await supabase
    .from("attendance")
    .select("session_id, presente")
    .eq("student_id", user.id);

  const attendanceMap = new Map(
    (attendance ?? []).map((a) => [a.session_id, a.presente])
  );

  const sessionList = (sessions ?? []) as ClassSession[];
  const dictadas = sessionList.filter((s) => s.estado === "dictado");
  const presentes = dictadas.filter((s) => attendanceMap.get(s.id)).length;

  const sessionIds = sessionList.map((s) => s.id);
  const { data: materialRows } = sessionIds.length
    ? await supabase.from("materials").select("*").in("session_id", sessionIds)
    : { data: [] };
  const materialsMap = new Map<string, Material[]>();
  for (const m of (materialRows ?? []) as Material[]) {
    const list = materialsMap.get(m.session_id) ?? [];
    list.push(m);
    materialsMap.set(m.session_id, list);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <Link href="/dashboard" className="text-sm font-semibold text-primary">
        ← Volver a mis cursos
      </Link>

      <div className="flex flex-col gap-6 rounded-3xl border border-border p-6 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="text-xs font-semibold italic text-primary/70">
            registro
          </span>
          <h1 className="text-2xl font-black">Bitácora</h1>
          <p className="mt-2 text-sm text-foreground/70">
            {course.title} — historial de encuentros con temario y asistencia.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl bg-cream-dark p-4 text-center">
          <p className="text-xs font-semibold italic text-primary/70">
            presenza
          </p>
          <p className="text-xs font-bold uppercase tracking-wide">
            Asistencia
          </p>
          <p className="mt-2 text-lg font-black">
            {presentes}/{dictadas.length} encuentros
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border p-6">
        <p className="mb-2 text-xs font-semibold italic text-primary/70">
          storia
        </p>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
          Historial
        </h2>
        {sessionList.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground/60">
            Todavía no hay encuentros cargados para este curso.
          </p>
        ) : (
          sessionList.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              presente={attendanceMap.get(session.id)}
              materials={materialsMap.get(session.id) ?? []}
            />
          ))
        )}
      </div>
    </div>
  );
}
