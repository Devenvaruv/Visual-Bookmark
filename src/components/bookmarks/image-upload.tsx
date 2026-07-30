"use client";

import { UploadCloud } from "lucide-react";
import { useState } from "react";

type Props = {
  value: string | null;
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
};

export function ImageUpload({ value, onUploaded, onError }: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      onError("Choose an image file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/uploads", { method: "POST", body: formData });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Failed to upload image.");
      }

      onUploaded(payload.url);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center transition hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Uploaded bookmark preview" className="mb-3 h-16 w-16 rounded-lg object-cover" />
      ) : (
        <UploadCloud className="mb-3 h-9 w-9 text-slate-500" />
      )}
      <span className="text-sm font-medium text-slate-900">{uploading ? "Uploading..." : "Upload Image"}</span>
      <span className="mt-1 text-xs text-slate-500">PNG, JPG, WebP, GIF, or SVG</span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={uploading}
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
    </label>
  );
}

