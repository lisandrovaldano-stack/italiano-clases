"use client";

import { useRef, useState, useTransition } from "react";
import { createLibraryItem, deleteLibraryItem } from "@/app/dashboard/biblioteca/actions";
import type { LibraryItem } from "@/lib/database.types";

function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function LibraryCard({
  item,
  canDelete,
  onDelete,
  deleting,
}: {
  item: LibraryItem;
  canDelete: boolean;
  onDelete: () => void;
  deleting: boolean;
}) {
  const ytId = item.kind === "youtube" ? youtubeId(item.url) : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      {item.kind === "youtube" && ytId && (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={item.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {item.kind === "image" && (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt={item.title} className="max-h-64 w-full object-cover" />
        </a>
      )}

      <div className="space-y-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold">{item.title}</h3>
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="shrink-0 text-xs font-semibold text-accent hover:underline disabled:opacity-50"
            >
              {deleting ? "Quitando…" : "Eliminar"}
            </button>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-foreground/70">{item.description}</p>
        )}
        {(item.kind === "file" || item.kind === "link") && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-semibold text-primary hover:underline"
          >
            {item.kind === "file" ? `↓ ${item.file_name}` : "Ver enlace →"}
          </a>
        )}
      </div>
    </div>
  );
}

export function LibraryManager({
  items,
  isTeacher,
}: {
  items: LibraryItem[];
  isTeacher: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isCreating, startCreateTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startDeleteTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");

    startCreateTransition(async () => {
      const result = await createLibraryItem(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  function handleDelete(itemId: string) {
    if (!confirm("¿Eliminar este recurso de la biblioteca?")) return;

    const fd = new FormData();
    fd.set("item_id", itemId);
    setError("");
    setDeletingId(itemId);

    startDeleteTransition(async () => {
      const result = await deleteLibraryItem(fd);
      if (result?.error) setError(result.error);
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-6">
      {isTeacher && (
        <details className="rounded-3xl border border-border p-6">
          <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide">
            + Agregar a la biblioteca
          </summary>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <input
              name="title"
              required
              placeholder="Título"
              className="rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary sm:col-span-2"
            />
            <textarea
              name="description"
              rows={2}
              placeholder="Descripción (opcional)"
              className="rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary sm:col-span-2"
            />
            <input
              name="url"
              placeholder="Link de YouTube u otro enlace"
              className="rounded-xl border border-border bg-cream-dark px-4 py-2 outline-none focus:border-primary"
            />
            <input type="file" name="file" className="rounded-xl border border-border bg-cream-dark px-4 py-2 text-sm" />
            <p className="text-xs text-foreground/60 sm:col-span-2">
              Pegá un link (YouTube, etc.) o subí un archivo/foto — con uno alcanza.
            </p>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50 sm:col-span-2"
            >
              {isCreating ? "Guardando…" : "Agregar"}
            </button>
          </form>
          {error && <p className="mt-2 text-xs text-accent">{error}</p>}
        </details>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-foreground/60">
          Todavía no hay nada cargado en la biblioteca.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <LibraryCard
              key={item.id}
              item={item}
              canDelete={isTeacher}
              deleting={deletingId === item.id}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
