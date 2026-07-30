"use client";

import clsx from "clsx";
import { placeholders } from "@/lib/placeholders";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function PlaceholderPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-6 gap-2 rounded-lg border border-slate-200 p-3">
      {placeholders.map((placeholder) => (
        <button
          key={placeholder.id}
          type="button"
          onClick={() => onChange(placeholder.id)}
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-blue-500",
            placeholder.bg,
            placeholder.fg,
            value === placeholder.id ? "border-blue-500 ring-1 ring-blue-500" : "border-transparent hover:border-slate-200"
          )}
          title={placeholder.label}
        >
          <placeholder.Icon className="h-5 w-5" />
          <span className="sr-only">{placeholder.label}</span>
        </button>
      ))}
    </div>
  );
}

