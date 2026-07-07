"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Level } from "@/lib/database.types";

export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("courses").insert({
    title: String(formData.get("title")),
    level: String(formData.get("level")) as Level,
    description: String(formData.get("description") ?? "") || null,
    schedule_text: String(formData.get("schedule_text") ?? "") || null,
    start_date: String(formData.get("start_date") ?? "") || null,
    end_date: String(formData.get("end_date") ?? "") || null,
  });
  revalidatePath("/admin");
  revalidatePath("/cursos");
}

export async function enrollStudent(formData: FormData) {
  const courseId = String(formData.get("course_id"));
  const studentId = String(formData.get("student_id"));
  const supabase = await createClient();
  await supabase
    .from("enrollments")
    .insert({ course_id: courseId, student_id: studentId });
  revalidatePath(`/admin/curso/${courseId}`);
}

export async function unenrollStudent(formData: FormData) {
  const enrollmentId = String(formData.get("enrollment_id"));
  const courseId = String(formData.get("course_id"));
  const supabase = await createClient();
  await supabase.from("enrollments").delete().eq("id", enrollmentId);
  revalidatePath(`/admin/curso/${courseId}`);
}
