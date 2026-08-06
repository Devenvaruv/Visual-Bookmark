"use client";

import { Globe2, ImageIcon, UploadCloud, X } from "lucide-react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaviconPicker } from "@/components/bookmarks/favicon-picker";
import { ImageUpload } from "@/components/bookmarks/image-upload";
import { PlaceholderPicker } from "@/components/bookmarks/placeholder-picker";
import { deriveBookmarkTitleFromUrl } from "@/lib/urls";

type Props = {
  open: boolean;
  boardId: string | null;
  onClose: () => void;
  onCreated: () => void;
  onError: (message: string) => void;
};

type ImageMode = "PLACEHOLDER" | "UPLOAD" | "FAVICON";

export function BookmarkPanel({ open, boardId, onClose, onCreated, onError }: Props) {
  const [title, setTitle] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [url, setUrl] = useState("");
  const [imageMode, setImageMode] = useState<ImageMode>("PLACEHOLDER");
  const [placeholder, setPlaceholder] = useState("video");
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [fetchingFavicon, setFetchingFavicon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const faviconRequestId = useRef(0);

  const fetchFavicon = useCallback(
    async (targetUrl: string, options: { notify?: boolean } = {}) => {
      const requestId = faviconRequestId.current + 1;
      faviconRequestId.current = requestId;
      const notify = options.notify ?? true;

      setLocalError(null);

      if (!targetUrl.trim()) {
        const message = "Enter a URL before using the favicon.";
        setLocalError(message);
        if (notify) {
          onError(message);
        }
        throw new Error(message);
      }

      setFetchingFavicon(true);

      try {
        const response = await fetch("/api/favicon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl })
        });
        const payload = (await response.json()) as { url?: string; error?: string };

        if (!response.ok || !payload.url) {
          throw new Error(payload.error ?? "Failed to fetch favicon.");
        }

        if (faviconRequestId.current === requestId) {
          setFaviconUrl(payload.url);
        }
        return payload.url;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch favicon.";
        if (faviconRequestId.current === requestId) {
          setLocalError(message);
        }
        if (notify) {
          onError(message);
        }
        throw error;
      } finally {
        if (faviconRequestId.current === requestId) {
          setFetchingFavicon(false);
        }
      }
    },
    [onError]
  );

  useEffect(() => {
    if (!open || imageMode !== "FAVICON") {
      faviconRequestId.current += 1;
      setFetchingFavicon(false);
      return;
    }

    faviconRequestId.current += 1;
    setFaviconUrl(null);

    if (!url.trim()) {
      setFetchingFavicon(false);
      setLocalError("Enter a URL before using the favicon.");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      fetchFavicon(url, { notify: false }).catch(() => undefined);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [fetchFavicon, imageMode, open, url]);

  if (!open) {
    return null;
  }

  function handleUrlChange(nextUrl: string) {
    const nextGeneratedTitle = deriveBookmarkTitleFromUrl(nextUrl);

    setUrl(nextUrl);
    setFaviconUrl(null);
    setGeneratedTitle(nextGeneratedTitle);
    setTitle((currentTitle) => {
      if (!currentTitle.trim() || currentTitle === generatedTitle) {
        return nextGeneratedTitle;
      }

      return currentTitle;
    });
  }

  async function handleSubmit() {
    if (!boardId) {
      setLocalError("Select a board first.");
      return;
    }

    setSubmitting(true);
    setLocalError(null);

    try {
      const imageValue =
        imageMode === "PLACEHOLDER"
          ? placeholder
          : imageMode === "UPLOAD"
            ? uploadUrl
            : faviconUrl ?? (await fetchFavicon(url));

      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId,
          title,
          url,
          imageType: imageMode,
          imageValue: imageValue ?? ""
        })
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to create bookmark.");
      }

      setTitle("");
      setGeneratedTitle("");
      setUrl("");
      setPlaceholder("video");
      setUploadUrl(null);
      setFaviconUrl(null);
      setImageMode("PLACEHOLDER");
      onCreated();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create bookmark.";
      setLocalError(message);
      onError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="absolute inset-x-3 top-4 z-20 flex max-h-[calc(100vh-2rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-panel sm:inset-x-auto sm:right-6 sm:top-6 sm:w-[360px] lg:right-8 lg:top-8">
      <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-6">
        <h2 className="text-xl font-semibold text-slate-950">New Bookmark</h2>
        <button
          type="button"
          className="rounded-md p-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close panel</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 pb-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-900">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter title"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-900">URL</span>
          <input
            value={url}
            onChange={(event) => handleUrlChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="https://example.com"
          />
        </label>

        <section>
          <h3 className="text-sm font-semibold text-slate-900">Image</h3>
          <p className="mt-1 text-sm text-slate-500">Choose how you want to add an image.</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <button
              type="button"
              className={clsx(
                "rounded-lg border p-3 text-center transition focus:outline-none focus:ring-2 focus:ring-blue-500",
                imageMode === "PLACEHOLDER" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
              )}
              onClick={() => setImageMode("PLACEHOLDER")}
            >
              <ImageIcon className="mx-auto mb-2 h-7 w-7 text-blue-600" />
              <span className="block text-sm font-semibold text-slate-900">Use Placeholder</span>
            </button>
            <button
              type="button"
              className={clsx(
                "rounded-lg border p-3 text-center transition focus:outline-none focus:ring-2 focus:ring-blue-500",
                imageMode === "UPLOAD" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
              )}
              onClick={() => setImageMode("UPLOAD")}
            >
              <UploadCloud className="mx-auto mb-2 h-7 w-7 text-slate-600" />
              <span className="block text-sm font-semibold text-slate-900">Upload Image</span>
            </button>
            <button
              type="button"
              className={clsx(
                "rounded-lg border p-3 text-center transition focus:outline-none focus:ring-2 focus:ring-blue-500",
                imageMode === "FAVICON" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
              )}
              onClick={() => setImageMode("FAVICON")}
            >
              <Globe2 className="mx-auto mb-2 h-7 w-7 text-emerald-600" />
              <span className="block text-sm font-semibold text-slate-900">Use Favicon</span>
            </button>
          </div>
        </section>

        {imageMode === "PLACEHOLDER" ? (
          <PlaceholderPicker value={placeholder} onChange={setPlaceholder} />
        ) : imageMode === "UPLOAD" ? (
          <ImageUpload value={uploadUrl} onUploaded={setUploadUrl} onError={setLocalError} />
        ) : (
          <FaviconPicker value={faviconUrl} loading={fetchingFavicon} />
        )}

        {localError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{localError}</p>}

      </div>

      <div className="flex shrink-0 gap-3 border-t border-slate-100 bg-white px-6 py-4">
        <button
          type="button"
          className="h-11 flex-1 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="h-11 flex-[1.6] rounded-lg bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          onClick={() => void handleSubmit()}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Bookmark"}
        </button>
      </div>
    </aside>
  );
}
