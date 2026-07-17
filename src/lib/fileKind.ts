export type FileKind = "video" | "pdf" | "image" | "other";

const VIDEO_EXT = [".mp4", ".mov", ".webm", ".m4v"];
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export function detectFileKind(fileName: string): FileKind {
  const lower = fileName.toLowerCase();
  if (VIDEO_EXT.some((ext) => lower.endsWith(ext))) return "video";
  if (lower.endsWith(".pdf")) return "pdf";
  if (IMAGE_EXT.some((ext) => lower.endsWith(ext))) return "image";
  return "other";
}

export function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}
