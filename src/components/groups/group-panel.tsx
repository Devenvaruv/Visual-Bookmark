"use client";

import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
};

export function GroupPanel({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  async function handleSubmit() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Group name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onCreate(trimmedName);
      setName("");
      onClose();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create group.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="absolute inset-x-3 top-4 z-20 flex max-h-[calc(100vh-2rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-panel sm:inset-x-auto sm:right-6 sm:top-6 sm:w-[360px] lg:right-8 lg:top-8">
      <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-6">
        <h2 className="text-xl font-semibold text-slate-950">New Group</h2>
        <button
          type="button"
          className="rounded-md p-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close panel</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 px-6 pb-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-900">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSubmit();
              }
            }}
            className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter group name"
            autoFocus
          />
        </label>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
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
          {submitting ? "Creating..." : "Create Group"}
        </button>
      </div>
    </aside>
  );
}

