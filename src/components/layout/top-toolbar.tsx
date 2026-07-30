"use client";

import { Plus } from "lucide-react";

type Props = {
  onNewBookmark: () => void;
  onNewGroup: () => void;
};

export function TopToolbar({ onNewBookmark, onNewGroup }: Props) {
  return (
    <header className="flex h-24 items-center border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onNewBookmark}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5" />
          New Bookmark
        </button>
        <button
          type="button"
          onClick={onNewGroup}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 font-medium text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5" />
          New Group
        </button>
      </div>
    </header>
  );
}
