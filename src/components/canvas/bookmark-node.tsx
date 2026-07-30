"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { useRef } from "react";
import { getPlaceholder } from "@/lib/placeholders";
import type { BookmarkRecord } from "@/types/canvas";

export type BookmarkNodeData = BookmarkRecord & {
  onOpen: (bookmark: BookmarkRecord) => void;
  onDelete: (bookmark: BookmarkRecord) => void;
};

export type BookmarkNodeType = Node<BookmarkNodeData, "bookmark">;

export function BookmarkNode({ data }: NodeProps<BookmarkNodeType>) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const placeholder = getPlaceholder(data.imageValue);

  function isActionTarget(target: EventTarget | null) {
    return target instanceof Element && Boolean(target.closest("button, .nodrag, [data-node-action]"));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;

    if (!start || isActionTarget(event.target)) {
      return;
    }

    const moved = Math.abs(event.clientX - start.x) + Math.abs(event.clientY - start.y);
    if (moved < 6) {
      data.onOpen(data);
    }
  }

  return (
    <div
      className="group flex h-24 w-44 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 shadow-sm transition hover:border-blue-200 hover:shadow-md"
      onPointerDown={(event) => {
        if (isActionTarget(event.target)) {
          pointerStart.current = null;
          return;
        }
        pointerStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={handlePointerUp}
    >
      {data.imageType === "UPLOAD" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.imageValue} alt={`${data.title} thumbnail`} className="h-12 w-12 rounded-lg object-cover" />
      ) : (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${placeholder.bg} ${placeholder.fg}`}>
          <placeholder.Icon className="h-7 w-7" />
        </div>
      )}
      <span className="min-w-0 flex-1 overflow-hidden break-all text-[11px] font-semibold leading-snug text-slate-950">
        {data.title}
      </span>
      <button
        type="button"
        data-node-action="delete"
        className="nodrag rounded p-1 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 group-hover:opacity-100"
        onPointerDown={(event) => {
          event.stopPropagation();
          pointerStart.current = null;
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
          data.onDelete(data);
        }}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete {data.title}</span>
      </button>
    </div>
  );
}
