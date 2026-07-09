"use client";

import { useRef, useState, useTransition } from "react";
import { uploadMaterial, removeMaterial } from "@/app/admin/curso/[id]/actions";
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
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isUploading, startUploadTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [, startRemoveTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Elegí un archivo primero.");
      return;
    }

    const fd = new FormData();
    fd.set("session_id", sessionId);
    fd.set("course_id", courseId);
    fd.set("file", file);
    setError("");

    startUploadTransition(async () => {
      const result = await uploadMaterial(fd);
      if (result?.error) {
        setError(result.error);
      } else if (fileRef.current) {
        fileRef.current.value = "";
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
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <input ref={fileRef} type="file" className="text-xs" />
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
        <ul className="space-y-1.5">
          {materials.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-cream-dark px-3 py-1.5"
            >
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-xs font-semibold text-primary hover:underline"
              >
                ↓ {m.file_name}
              </a>
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
