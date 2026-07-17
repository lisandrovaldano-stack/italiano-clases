import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { LibraryManager } from "@/components/LibraryManager";
import type { LibraryItem } from "@/lib/database.types";

export default async function BibliotecaPage() {
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("library_items")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (data ?? []) as LibraryItem[];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div>
        <span className="text-xs font-semibold italic text-primary/70">
          biblioteca multimediale
        </span>
        <h1 className="text-3xl font-black">Biblioteca Multimediale</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Videos, fotos y archivos compartidos por María Verónica para todos los alumnos.
        </p>
      </div>

      <LibraryManager items={items} isTeacher={profile.role === "teacher"} />
    </div>
  );
}
