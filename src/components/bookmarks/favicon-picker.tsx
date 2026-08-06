"use client";

import { Globe2, RefreshCw } from "lucide-react";

type Props = {
  value: string | null;
  loading: boolean;
};

export function FaviconPicker({ value, loading }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Website favicon preview" className="h-10 w-10 object-contain" />
          ) : (
            <Globe2 className="h-8 w-8 text-slate-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            {loading && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
            {loading ? "Extracting favicon..." : value ? "Favicon ready" : "Waiting for URL"}
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">{value ?? "The website icon appears here."}</p>
        </div>
      </div>
    </div>
  );
}
