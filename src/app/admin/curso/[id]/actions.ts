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

export async function uploadMaterial(
  formData: FormData
): Promise<{ error?: string }> {
  const sessionId = String(formData.get("session_id"));
  const courseId = String(formData.get("course_id"));
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "Elegí un archivo primero." };
  }

  const supabase = await createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${courseId}/${sessionId}-${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from("materiales")
    .upload(path, file, { upsert: true });

  if (error) {
    return { error: `No se pudo subir el archivo: ${error.message}` };
  }

  const { data } = supabase.storage.from("materiales").getPublicUrl(path);
  const { error: insertError } = await supabase.from("materials").insert({
    session_id: sessionId,
    file_name: file.name,
    url: data.publicUrl,
  });

  if (insertError) {
    return { error: `Se subió el archivo pero no se pudo guardar: ${insertError.message}` };
  }

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
  return {};
}

export async function removeMaterial(
  formData: FormData
): Promise<{ error?: string }> {
  const materialId = String(formData.get("material_id"));
  const courseId = String(formData.get("course_id"));

  const supabase = await createClient();
  const { error } = await supabase.from("materials").delete().eq("id", materialId);

  if (error) {
    return { error: `No se pudo quitar el material: ${error.message}` };
  }

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
  return {};
}

export async function createTask(formData: FormData): Promise<{ error?: string }> {
  const sessionId = String(formData.get("session_id"));
  const courseId = String(formData.get("course_id"));
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const dueDate = String(formData.get("due_date") ?? "") || null;
  const file = formData.get("file") as File | null;

  if (!title) {
    return { error: "Poné un título para la tarea." };
  }

  const supabase = await createClient();
  let fileUrl: string | null = null;
  let fileName: string | null = null;

  if (file && file.size > 0) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${courseId}/tareas/${sessionId}-${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("materiales")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      return { error: `No se pudo subir el archivo: ${uploadError.message}` };
    }

    const { data } = supabase.storage.from("materiales").getPublicUrl(path);
    fileUrl = data.publicUrl;
    fileName = file.name;
  }

  const { error: insertError } = await supabase.from("tasks").insert({
    session_id: sessionId,
    title,
    description,
    due_date: dueDate,
    file_name: fileName,
    file_url: fileUrl,
  });

  if (insertError) {
    return { error: `No se pudo guardar la tarea: ${insertError.message}` };
  }

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
  return {};
}

export async function updateTask(formData: FormData): Promise<{ error?: string }> {
  const taskId = String(formData.get("task_id"));
  const courseId = String(formData.get("course_id"));
  const sessionId = String(formData.get("session_id"));
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const dueDate = String(formData.get("due_date") ?? "") || null;
  const file = formData.get("file") as File | null;

  if (!title) {
    return { error: "Poné un título para la tarea." };
  }

  const supabase = await createClient();
  const update: {
    title: string;
    description: string | null;
    due_date: string | null;
    file_name?: string;
    file_url?: string;
  } = { title, description, due_date: dueDate };

  if (file && file.size > 0) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${courseId}/tareas/${sessionId}-${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("materiales")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      return { error: `No se pudo subir el archivo: ${uploadError.message}` };
    }

    const { data } = supabase.storage.from("materiales").getPublicUrl(path);
    update.file_url = data.publicUrl;
    update.file_name = file.name;
  }

  const { error: updateError } = await supabase
    .from("tasks")
    .update(update)
    .eq("id", taskId);

  if (updateError) {
    return { error: `No se pudo guardar la tarea: ${updateError.message}` };
  }

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
  return {};
}

export async function deleteTask(formData: FormData): Promise<{ error?: string }> {
  const taskId = String(formData.get("task_id"));
  const courseId = String(formData.get("course_id"));

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    return { error: `No se pudo eliminar la tarea: ${error.message}` };
  }

  revalidatePath(`/admin/curso/${courseId}`);
  revalidatePath(`/dashboard/curso/${courseId}`);
  return {};
}

export async function setAttendance(formData: FormData) {
  const sessionId = String(formData.get("session_id"));
  const studentId = String(formData.get("student_id"));
  const courseId = String(formData.get("course_id"));
  const presente = formData.get("presente") === "true";

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
