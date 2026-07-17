import { MaterialPreview } from "@/components/MaterialPreview";
import type { ClassSession, Material, Task } from "@/lib/database.types";

const ESTADO_LABEL: Record<string, { label: string; className: string }> = {
  programado: { label: "Programado", className: "bg-primary-light text-primary" },
  dictado: { label: "Dictado", className: "bg-primary text-white" },
  cancelado: { label: "Cancelado", className: "bg-accent-light text-accent" },
};

function formatDueDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SessionRow({
  session,
  presente,
  materials = [],
  tasks = [],
  children,
}: {
  session: ClassSession;
  presente?: boolean | null;
  materials?: Material[];
  tasks?: Task[];
  children?: React.ReactNode;
}) {
  const estado = ESTADO_LABEL[session.estado];
  const fecha = new Date(session.fecha).toLocaleString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex gap-4 border-b border-border py-4 last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-dark text-sm font-bold">
        #{session.numero}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{fecha}</span>
          <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${estado.className}`}>
            {estado.label}
          </span>
          {presente !== undefined && presente !== null && (
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                presente ? "bg-primary-light text-primary" : "bg-accent-light text-accent"
              }`}
            >
              {presente ? "Presente" : "Ausente"}
            </span>
          )}
        </div>
        {session.temario && (
          <p className="text-sm text-foreground/70">{session.temario}</p>
        )}
        {materials.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {materials.map((m) => (
              <MaterialPreview key={m.id} url={m.url} fileName={m.file_name} />
            ))}
          </div>
        )}
        {tasks.length > 0 && (
          <div className="space-y-1.5">
            {tasks.map((t) => (
              <div key={t.id} className="rounded-xl bg-accent-light px-3 py-2">
                <p className="text-sm font-semibold text-accent">📝 {t.title}</p>
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
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
