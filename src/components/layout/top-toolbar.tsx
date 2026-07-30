"use client";

import { Grid2X2, Plus, Search, Settings } from "lucide-react";

type Props = {
  onNewBookmark: () => void;
  onNewGroup: () => void;
};

export function TopToolbar({ onNewBookmark, onNewGroup }: Props) {
  return (
    <header className="flex h-24 items-center justify-between border-b border-slate-200 bg-white px-8">
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
      <div className="flex items-center gap-5 text-slate-700">
        <button type="button" className="rounded-lg p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Search className="h-6 w-6" />
          <span className="sr-only">Search</span>
        </button>
        <button type="button" className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Grid2X2 className="h-5 w-5" />
          <span className="sr-only">Canvas layout</span>
        </button>
        <button type="button" className="rounded-lg p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Settings className="h-6 w-6" />
          <span className="sr-only">Settings</span>
        </button>
      </div>
    </header>
  );
}

