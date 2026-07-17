"use client";

import { useRef, useState, useTransition } from "react";
import { createTask, updateTask, deleteTask } from "@/app/admin/curso/[id]/actions";
import type { Task } from "@/lib/database.types";

function formatDueDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TaskEditForm({
  task,
  sessionId,
  courseId,
  onDone,
}: {
  task: Task;
  sessionId: string;
  courseId: string;
  onDone: () => void;
}) {
  const [error, setError] = useState("");
  const [isSaving, startSaveTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("task_id", task.id);
    fd.set("session_id", sessionId);
    fd.set("course_id", courseId);
    setError("");

    startSaveTransition(async () => {
      const result = await updateTask(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        onDone();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-2">
      <input
        name="title"
        required
        defaultValue={task.title}
        placeholder="Título de la tarea"
        className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary sm:col-span-2"
      />
      <textarea
        name="description"
        rows={2}
        defaultValue={task.description ?? ""}
        placeholder="Consigna (opcional)"
        className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary sm:col-span-2"
      />
      <input
        type="date"
        name="due_date"
        defaultValue={task.due_date ?? ""}
        className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
      />
      <input type="file" name="file" className="text-xs" />
      {task.file_name && (
        <p className="text-xs text-foreground/60 sm:col-span-2">
          Archivo actual: {task.file_name} (subí uno nuevo solo si querés reemplazarlo)
        </p>
      )}
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {isSaving ? "Guardando…" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-cream-dark"
        >
          Cancelar
        </button>
      </div>
      {error && <p className="text-xs text-accent sm:col-span-2">{error}</p>}
    </form>
  );
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
  const [editingId, setEditingId] = useState<string | null>(null);
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
          {tasks.map((t) =>
            editingId === t.id ? (
              <li key={t.id} className="rounded-xl bg-cream-dark px-3 py-2">
                <TaskEditForm
                  task={t}
                  sessionId={sessionId}
                  courseId={courseId}
                  onDone={() => setEditingId(null)}
                />
              </li>
            ) : (
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
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(t.id)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                      className="text-xs font-semibold text-accent hover:underline disabled:opacity-50"
                    >
                      {deletingId === t.id ? "Quitando…" : "Eliminar"}
                    </button>
                  </div>
                </div>
              </li>
            )
          )}
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
