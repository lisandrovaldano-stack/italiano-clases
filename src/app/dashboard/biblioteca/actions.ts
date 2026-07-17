"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LibraryKind } from "@/lib/database.types";

function detectYouTube(url: string): boolean {
  return /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/.test(url);
}

export async function createLibraryItem(
  formData: FormData
): Promise<{ error?: string }> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const url = String(formData.get("url") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!title) {
    return { error: "Poné un título." };
  }
  if (!url && (!file || file.size === 0)) {
    return { error: "Pegá un link o subí un archivo." };
  }

  const supabase = await createClient();

  let kind: LibraryKind;
  let finalUrl: string;
  let fileName: string | null = null;

  if (file && file.size > 0) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `biblioteca/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("materiales")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      return { error: `No se pudo subir el archivo: ${uploadError.message}` };
    }

    const { data } = supabase.storage.from("materiales").getPublicUrl(path);
    finalUrl = data.publicUrl;
    fileName = file.name;
    kind = file.type.startsWith("image/") ? "image" : "file";
  } else {
    finalUrl = url;
    kind = detectYouTube(url) ? "youtube" : "link";
  }

  const { error: insertError } = await supabase.from("library_items").insert({
    title,
    description,
    kind,
    url: finalUrl,
    file_name: fileName,
  });

  if (insertError) {
    return { error: `No se pudo guardar: ${insertError.message}` };
  }

  revalidatePath("/dashboard/biblioteca");
  return {};
}

export async function deleteLibraryItem(
  formData: FormData
): Promise<{ error?: string }> {
  const itemId = String(formData.get("item_id"));

  const supabase = await createClient();
  const { error } = await supabase.from("library_items").delete().eq("id", itemId);

  if (error) {
    return { error: `No se pudo eliminar: ${error.message}` };
  }

  revalidatePath("/dashboard/biblioteca");
  return {};
}
