import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export async function storeLocalImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Upload must be an image.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image must be smaller than 2 MB.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const extension = extensionForType(file.type);
  const name = `${crypto.randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, name), buffer);

  return `/uploads/${name}`;
}

function extensionForType(type: string) {
  switch (type) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    default:
      return ".jpg";
  }
}

