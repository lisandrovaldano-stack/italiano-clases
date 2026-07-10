"use client";

import { useRef, useState, useTransition } from "react";
import { createTask, deleteTask } from "@/app/admin/curso/[id]/actions";
import type { Task } from "@/lib/database.types";

function formatDueDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TaskManager({
  sessionId,
  courseId,
  tasks,
}: {
  sessionId: string;
  courseId: string;
  tasks: Task[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isCreating, startCreateTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startDeleteTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("session_id", sessionId);
    fd.set("course_id", courseId);
    setError("");

    startCreateTransition(async () => {
      const result = await createTask(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  function handleDelete(taskId: string) {
    if (!confirm("¿Eliminar esta tarea?")) return;

    const fd = new FormData();
    fd.set("task_id", taskId);
    fd.set("course_id", courseId);
    setError("");
    setDeletingId(taskId);

    startDeleteTransition(async () => {
      const result = await deleteTask(fd);
      if (result?.error) setError(result.error);
      setDeletingId(null);
    });
  }

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <p className="text-xs font-bold uppercase tracking-wide text-foreground/60">
        Tareas
      </p>

      {tasks.length > 0 && (
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li key={t.id} className="rounded-xl bg-cream-dark px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{t.title}</p>
                  {t.description && (
                    <p className="text-xs text-foreground/70">{t.description}</p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-foreground/60">
                    {t.due_date && <span>Entrega: {formatDueDate(t.due_date)}</span>}
                    {t.file_url && (
                      <a
                        href={t.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        ↓ {t.file_name}
                      </a>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className="shrink-0 text-xs font-semibold text-accent hover:underline disabled:opacity-50"
                >
                  {deletingId === t.id ? "Quitando…" : "Eliminar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-2">
        <input
          name="title"
          required
          placeholder="Título de la tarea"
          className="rounded-xl border border-border bg-cream-dark px-3 py-1.5 text-sm outline-none focus:border-primary sm:col-span-2"
        />
        <textarea
          name="description"
          rows={2}
          placeholder="Consigna (opcional)"
          className="rounded-xl border border-border bg-cream-dark px-3 py-1.5 text-sm outline-none focus:border-primary sm:col-span-2"
        />
        <input
          type="date"
          name="due_date"
          className="rounded-xl border border-border bg-cream-dark px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
        <input ref={fileRef} type="file" name="file" className="text-xs" />
        <button
          type="submit"
          disabled={isCreating}
          className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-cream-dark disabled:opacity-50 sm:col-span-2"
        >
          {isCreating ? "Guardando…" : "+ Agregar tarea"}
        </button>
      </form>
      {error && <p className="text-xs text-accent">{error}</p>}
    </div>
  );
}
