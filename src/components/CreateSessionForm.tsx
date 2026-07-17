"use client";

import { useRef, useState, useTransition } from "react";
import { createSession } from "@/app/admin/curso/[id]/actions";

export function CreateSessionForm({ courseId }: { courseId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isCreating, startCreateTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("course_id", courseId);
    setError("");

    startCreateTransition(async () => {
      const result = await createSession(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
      <div>
        <label className="text-sm font-semibold">Link (YouTube u otro, opcional)</label>
        <input
          name="url"
          className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Archivo (PDF, MP4, foto… opcional)</label>
        <input
          type="file"
          name="file"
          className="mt-1 w-full rounded-xl border border-border bg-cream-dark px-4 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-accent sm:col-span-2">{error}</p>}
      <button
        type="submit"
        disabled={isCreating}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50 sm:col-span-2"
      >
        {isCreating ? "Guardando…" : "Guardar encuentro"}
      </button>
    </form>
  );
}
