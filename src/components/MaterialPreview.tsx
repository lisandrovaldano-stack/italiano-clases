import { detectFileKind } from "@/lib/fileKind";

export function MaterialPreview({ url, fileName }: { url: string; fileName: string }) {
  const kind = detectFileKind(fileName);

  if (kind === "video") {
    return (
      <div className="w-full max-w-sm space-y-1">
        <video controls preload="metadata" className="w-full rounded-xl" src={url} />
        <p className="truncate text-xs text-foreground/60">{fileName}</p>
      </div>
    );
  }

  if (kind === "pdf") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-cream-dark"
      >
        📄 {fileName}
      </a>
    );
  }

  if (kind === "image") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={fileName} className="max-h-48 rounded-xl object-cover" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full border border-border px-4 py-1.5 text-xs font-semibold hover:bg-cream-dark"
    >
      ↓ {fileName}
    </a>
  );
}
