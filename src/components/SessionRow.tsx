import type { ClassSession } from "@/lib/database.types";

const ESTADO_LABEL: Record<string, { label: string; className: string }> = {
  programado: { label: "Programado", className: "bg-primary-light text-primary" },
  dictado: { label: "Dictado", className: "bg-primary text-white" },
  cancelado: { label: "Cancelado", className: "bg-accent-light text-accent" },
};

export function SessionRow({
  session,
  presente,
  children,
}: {
  session: ClassSession;
  presente?: boolean | null;
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
        {session.material_url && (
          <a
            href={session.material_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-cream-dark"
          >
            ↓ Descargar material
          </a>
        )}
        {children}
      </div>
    </div>
  );
}
