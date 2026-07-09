"use client";

import { useRef, useState, useTransition } from "react";
import { uploadMaterial, removeMaterial } from "@/app/admin/curso/[id]/actions";

export function MaterialUploadForm({
  sessionId,
  courseId,
  materialUrl,
}: {
  sessionId: string;
  courseId: string;
  materialUrl: string | null;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isRemoving, startRemoveTransition] = useTransition();

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

    startTransition(async () => {
      const result = await uploadMaterial(fd);
      if (result?.error) {
        setError(result.error);
      } else if (fileRef.current) {
        fileRef.current.value = "";
      }
    });
  }

  function handleRemove() {
    if (!confirm("¿Quitar el material subido para este encuentro?")) return;

    const fd = new FormData();
    fd.set("session_id", sessionId);
    fd.set("course_id", courseId);
    setError("");

    startRemoveTransition(async () => {
      const result = await removeMaterial(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <input ref={fileRef} type="file" className="text-xs" />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-cream-dark disabled:opacity-50"
        >
          {isPending ? "Subiendo…" : "Subir material"}
        </button>
        {materialUrl && (
          <>
            <a
              href={materialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary"
            >
              Ver material actual
            </a>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-xs font-semibold text-accent hover:underline disabled:opacity-50"
            >
              {isRemoving ? "Quitando…" : "Quitar"}
            </button>
          </>
        )}
      </form>
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}
