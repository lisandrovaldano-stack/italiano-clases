"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Level, SessionStatus } from "@/lib/database.types";

export async function deleteCourse(formData: FormData) {
  const courseId = String(formData.get("course_id"));
  const supabase = await createClient();

  await supabase.from("courses").delete().eq("id", courseId);

  revalidatePath("/admin");
  revalidatePath("/cursos");
  redirect("/admin");
}

export async function updateCourse(formData: FormData) {
  const courseId = String(formData.get("course_id"));
  const supabase = await createClient();

  await supabase
    .from("courses")
    .update({
      title: String(formData.get("title")),
      level: String(formData.get("level")) as Level,
      description: String(formData.get("description") ?? "") || null,
      schedule_text: String(formData.get("schedule_text") ?? "") || null,
      start_date: String(formData.get("start_date") ?? "") || null,
      end_date: String(formData.get("end_date") ?? "") || null,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", courseId);

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath("/admin");
  revalidatePath("/cursos");
  revalidatePath(`/cursos/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
}

export async function createSession(formData: FormData) {
  const courseId = String(formData.get("course_id"));
  const supabase = await createClient();

  const { count } = await supabase
    .from("class_sessions")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  await supabase.from("class_sessions").insert({
    course_id: courseId,
    numero: (count ?? 0) + 1,
    fecha: String(formData.get("fecha")),
    temario: String(formData.get("temario") ?? "") || null,
    estado: String(formData.get("estado")) as SessionStatus,
  });

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
}

export async function deleteSession(formData: FormData) {
  const sessionId = String(formData.get("session_id"));
  const courseId = String(formData.get("course_id"));

  const supabase = await createClient();
  await supabase.from("class_sessions").delete().eq("id", sessionId);

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
}

export async function updateSessionEstado(formData: FormData) {
  const sessionId = String(formData.get("session_id"));
  const courseId = String(formData.get("course_id"));
  const estado = String(formData.get("estado")) as SessionStatus;

  const supabase = await createClient();
  await supabase
    .from("class_sessions")
    .update({ estado })
    .eq("id", sessionId);

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
}

export async function uploadMaterial(formData: FormData) {
  const sessionId = String(formData.get("session_id"));
  const courseId = String(formData.get("course_id"));
  const file = formData.get("file") as File;

  if (!file || file.size === 0) return;

  const supabase = await createClient();
  const path = `${courseId}/${sessionId}-${file.name}`;
  const { error } = await supabase.storage
    .from("materiales")
    .upload(path, file, { upsert: true });

  if (!error) {
    const { data } = supabase.storage.from("materiales").getPublicUrl(path);
    await supabase
      .from("class_sessions")
      .update({ material_url: data.publicUrl })
      .eq("id", sessionId);
  }

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
}

export async function setAttendance(formData: FormData) {
  const sessionId = String(formData.get("session_id"));
  const studentId = String(formData.get("student_id"));
  const courseId = String(formData.get("course_id"));
  const presente = formData.get("presente") === "on";

  const supabase = await createClient();
  await supabase
    .from("attendance")
    .upsert(
      { session_id: sessionId, student_id: studentId, presente },
      { onConflict: "session_id,student_id" }
    );

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
}
