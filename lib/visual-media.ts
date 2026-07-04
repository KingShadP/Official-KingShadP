import fs from "fs";
import path from "path";

const VISUAL_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".mp4", ".webm", ".mov"]);

export type VisualMediaItem = {
  id: string;
  src: string;
  kind: "image" | "video";
  fileName: string;
};

function toPublicSrc(filePath: string) {
  const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
  return `/${relativePath
    .split(path.sep)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

function readMediaFiles(dirPath: string): string[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      return readMediaFiles(fullPath);
    }
    return VISUAL_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
  });
}

export function getVisualMedia(): VisualMediaItem[] {
  const publicDir = path.join(process.cwd(), "public");
  return readMediaFiles(publicDir)
    .sort((a, b) => a.localeCompare(b))
    .map((filePath, index) => ({
      id: `visual-${index}`,
      src: toPublicSrc(filePath),
      kind: [".mp4", ".webm", ".mov"].includes(path.extname(filePath).toLowerCase()) ? "video" : "image",
      fileName: path.basename(filePath),
    }));
}
