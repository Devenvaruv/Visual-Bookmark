"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { NodeResizer } from "@xyflow/react";
import { Grip, Pencil, Trash2 } from "lucide-react";
import type { GroupRecord } from "@/types/canvas";

export type GroupNodeData = GroupRecord & {
  onRename: (group: GroupRecord) => void;
  onDelete: (group: GroupRecord) => void;
  onResize: (groupId: string, width: number, height: number) => void;
};

export type GroupNodeType = Node<GroupNodeData, "group">;

export function GroupNode({ id, data, selected }: NodeProps<GroupNodeType>) {
  return (
    <div
      className="h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      style={{ minWidth: 260, minHeight: 180 }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={260}
        minHeight={180}
        lineClassName="border-blue-500"
        handleClassName="h-3 w-3 border border-blue-600 bg-white"
        onResizeEnd={(_event, params) => data.onResize(id, Math.round(params.width), Math.round(params.height))}
      />
      <div
        className="flex h-16 items-center gap-4 border-b border-slate-200 px-6"
        style={{ backgroundColor: data.color }}
      >
        <Grip className="h-5 w-5 text-slate-500" />
        <h2 className="min-w-0 flex-1 truncate text-lg font-semibold text-slate-950">{data.name}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="nodrag rounded p-1 text-slate-500 hover:bg-white/70 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => data.onRename(data)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Rename {data.name}</span>
          </button>
          <button
            type="button"
            className="nodrag rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => data.onDelete(data)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete {data.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
