"use client";

import { useRef, useState, useTransition } from "react";
import { uploadMaterial, removeMaterial } from "@/app/admin/curso/[id]/actions";
import { MaterialPreview } from "@/components/MaterialPreview";
import type { Material } from "@/lib/database.types";

export function MaterialUploadForm({
  sessionId,
  courseId,
  materials,
}: {
  sessionId: string;
  courseId: string;
  materials: Material[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isUploading, startUploadTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [, startRemoveTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File | null;
    const url = String(fd.get("url") ?? "").trim();

    if ((!file || file.size === 0) && !url) {
      setError("Pegá un link o subí un archivo.");
      return;
    }

    fd.set("session_id", sessionId);
    fd.set("course_id", courseId);
    setError("");

    startUploadTransition(async () => {
      const result = await uploadMaterial(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  function handleRemove(materialId: string) {
    if (!confirm("¿Quitar este material?")) return;

    const fd = new FormData();
    fd.set("material_id", materialId);
    fd.set("course_id", courseId);
    setError("");
    setRemovingId(materialId);

    startRemoveTransition(async () => {
      const result = await removeMaterial(fd);
      if (result?.error) setError(result.error);
      setRemovingId(null);
    });
  }

  return (
    <div className="mt-3 space-y-2">
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <input
          name="url"
          placeholder="Link de YouTube u otro enlace"
          className="min-w-[12rem] flex-1 rounded-xl border border-border bg-cream-dark px-3 py-1.5 text-xs outline-none focus:border-primary"
        />
        <input type="file" name="file" className="text-xs" />
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-cream-dark disabled:opacity-50"
        >
          {isUploading ? "Subiendo…" : "Subir material"}
        </button>
      </form>
      {error && <p className="text-xs text-accent">{error}</p>}

      {materials.length > 0 && (
        <ul className="space-y-2">
          {materials.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-cream-dark px-3 py-2"
            >
              <MaterialPreview url={m.url} fileName={m.file_name} />
              <button
                type="button"
                onClick={() => handleRemove(m.id)}
                disabled={removingId === m.id}
                className="shrink-0 text-xs font-semibold text-accent hover:underline disabled:opacity-50"
              >
                {removingId === m.id ? "Quitando…" : "Quitar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
