import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { enrollStudent, unenrollStudent } from "@/app/admin/actions";
import {
  createSession,
  updateSessionEstado,
  uploadMaterial,
  updateCourse,
  deleteCourse,
  deleteSession,
} from "./actions";
import { AttendanceToggle } from "@/components/AttendanceToggle";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import type { ClassSession, Level, Profile } from "@/lib/database.types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default async function AdminCursoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile) redirect("/login");
  if (profile.role !== "teacher") redirect("/dashboard");

  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  if (!course) notFound();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, student_id, profiles(id, full_name, avatar_color)")
    .eq("course_id", id);

  type EnrollmentRow = {
    id: string;
    student_id: string;
    profiles: Pick<Profile, "id" | "full_name" | "avatar_color"> | null;
  };
  const enrolled = (enrollments ?? []) as unknown as EnrollmentRow[];
  const enrolledIds = new Set(enrolled.map((e) => e.student_id));

  const { data: allStudents } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("full_name");
  const availableStudents = ((allStudents ?? []) as Profile[]).filter(
    (s) => !enrolledIds.has(s.id)
  );

  const { data: sessions } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("course_id", id)
    .order("numero", { ascending: false });
  const sessionList = (sessions ?? []) as ClassSession[];

  const sessionIds = sessionList.map((s) => s.id);
  const { data: attendanceRows } = sessionIds.length
    ? await supabase
        .from("attendance")
        .select("session_id, student_id, presente")
        .in("session_id", sessionIds)
    : { data: [] };
  const attendanceMap = new Map(
    (attendanceRows ?? []).map((a) => [`${a.session_id}:${a.student_id}`, a.presente])
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <Link href="/admin" className="text-sm font-semibold text-primary">
        ← Volver al panel
      </Link>

      <div>
        <h1 className="text-3xl font-black">{course.title}</h1>
        <p className="text-sm text-foreground/60">
          {course.level} · {course.schedule_text ?? "Sin horario"}
        </p>
      </div>

      {/* Editar curso */}
      <details className="rounded-3xl border border-border p-6">
        <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide">
          ✎ Editar curso
        </summary>
        <form action={updateCourse} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="course_id" value={course.id} />
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Título</label>
            <input
              name="title"
              required
              defaultValue={course.title}
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Nivel</label>
            <select
              name="level"
              required
              defaultValue={course.level}
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
              defaultValue={course.schedule_text ?? ""}
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
              placeholder="Sábados de 17 a 18 hs"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Fecha de inicio</label>
            <input
              type="date"
              name="start_date"
              defaultValue={course.start_date ?? ""}
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Fecha de fin</label>
            <input
              type="date"
              name="end_date"
              defaultValue={course.end_date ?? ""}
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Descripción</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={course.description ?? ""}
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
            <input type="checkbox" name="is_active" defaultChecked={course.is_active} />
            Curso activo (visible como &quot;activo&quot; en las estadísticas)
          </label>
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark sm:col-span-2"
          >
            Guardar cambios
          </button>
        </form>

        <div className="mt-6 border-t border-border pt-4">
          <form action={deleteCourse}>
            <input type="hidden" name="course_id" value={course.id} />
            <ConfirmSubmitButton
              message={`¿Eliminar definitivamente el curso "${course.title}"? Esto borra también todos sus encuentros, inscripciones y asistencias. Esta acción no se puede deshacer.`}
              className="rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent hover:bg-accent-light"
            >
              Eliminar curso definitivamente
            </ConfirmSubmitButton>
          </form>
        </div>
      </details>

      {/* Alumnos inscriptos */}
      <section className="rounded-3xl border border-border p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
          Alumnos inscriptos
        </h2>

        {enrolled.length === 0 ? (
          <p className="text-sm text-foreground/60">Sin alumnos todavía.</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {enrolled.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between rounded-xl bg-cream-dark px-4 py-2"
              >
                <span className="font-semibold">
                  {e.profiles?.full_name ?? "Alumno"}
                </span>
                <form action={unenrollStudent}>
                  <input type="hidden" name="enrollment_id" value={e.id} />
                  <input type="hidden" name="course_id" value={course.id} />
                  <button className="text-xs font-semibold text-accent">
                    Quitar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        {availableStudents.length > 0 && (
          <form action={enrollStudent} className="flex gap-2">
            <input type="hidden" name="course_id" value={course.id} />
            <select
              name="student_id"
              required
              className="flex-1 rounded-xl border border-border bg-cream-dark px-4 py-2"
            >
              <option value="">Elegí un alumno para inscribir…</option>
              {availableStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
            <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
              Inscribir
            </button>
          </form>
        )}
      </section>

      {/* Nuevo encuentro */}
      <section className="rounded-3xl border border-border p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
          Cargar nuevo encuentro
        </h2>
        <form action={createSession} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="course_id" value={course.id} />
          <div>
            <label className="text-sm font-semibold">Fecha y hora</label>
            <input
              type="datetime-local"
              name="fecha"
              required
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Estado</label>
            <select
              name="estado"
              defaultValue="programado"
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2"
            >
              <option value="programado">Programado</option>
              <option value="dictado">Dictado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Temario</label>
            <textarea
              name="temario"
              rows={2}
              className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2"
              placeholder="Repaso de unidad 1, verbos regulares…"
            />
          </div>
          <button className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark sm:col-span-2">
            Guardar encuentro
          </button>
        </form>
      </section>

      {/* Historial de encuentros */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wide">
          Historial de encuentros
        </h2>
        {sessionList.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-foreground/60">
            Todavía no cargaste ningún encuentro.
          </p>
        ) : (
          sessionList.map((session) => (
            <div key={session.id} className="rounded-2xl border border-border p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-bold">
                  #{session.numero} —{" "}
                  {new Date(session.fecha).toLocaleString("es-AR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <form action={updateSessionEstado} className="flex items-center gap-2">
                  <input type="hidden" name="session_id" value={session.id} />
                  <input type="hidden" name="course_id" value={course.id} />
                  <select
                    name="estado"
                    defaultValue={session.estado}
                    className="rounded-xl border border-border bg-cream-dark px-3 py-1.5 text-sm"
                  >
                    <option value="programado">Programado</option>
                    <option value="dictado">Dictado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-cream-dark">
                    Guardar
                  </button>
                </form>
                <form action={deleteSession}>
                  <input type="hidden" name="session_id" value={session.id} />
                  <input type="hidden" name="course_id" value={course.id} />
                  <ConfirmSubmitButton
                    message={`¿Eliminar el encuentro #${session.numero}? Esto también borra la asistencia cargada para ese encuentro.`}
                    className="rounded-xl border border-accent px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent-light"
                  >
                    Eliminar
                  </ConfirmSubmitButton>
                </form>
              </div>

              {session.temario && (
                <p className="mt-2 text-sm text-foreground/70">{session.temario}</p>
              )}

              <form action={uploadMaterial} className="mt-3 flex items-center gap-2">
                <input type="hidden" name="session_id" value={session.id} />
                <input type="hidden" name="course_id" value={course.id} />
                <input type="file" name="file" className="text-xs" />
                <button className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-cream-dark">
                  Subir material
                </button>
                {session.material_url && (
                  <a
                    href={session.material_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary"
                  >
                    Ver material actual
                  </a>
                )}
              </form>

              {enrolled.length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {enrolled.map((e) => (
                    <div
                      key={e.student_id}
                      className="flex items-center justify-between rounded-xl bg-cream-dark px-3 py-2"
                    >
                      <span className="text-sm">{e.profiles?.full_name}</span>
                      <AttendanceToggle
                        sessionId={session.id}
                        studentId={e.student_id}
                        courseId={course.id}
                        presente={attendanceMap.get(`${session.id}:${e.student_id}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
