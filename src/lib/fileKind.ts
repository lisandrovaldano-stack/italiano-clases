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
