"use client";

import { BriefcaseBusiness, ChevronLeft, FileText, GraduationCap, Plus, Trash2, UserRound, Video } from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/layout/brand-logo";
import type { BoardSummary } from "@/types/canvas";

type Props = {
  boards: BoardSummary[];
  selectedBoardId: string | null;
  collapsed: boolean;
  onCollapse: () => void;
  onSelectBoard: (boardId: string) => void;
  onCreateBoard: () => void;
  onRenameBoard: (board: BoardSummary) => void;
  onDeleteBoard: (board: BoardSummary) => void;
};

const boardIcons = [Video, BriefcaseBusiness, FileText, UserRound, GraduationCap];

export function AppSidebar({
  boards,
  selectedBoardId,
  collapsed,
  onCollapse,
  onSelectBoard,
  onCreateBoard,
  onRenameBoard,
  onDeleteBoard
}: Props) {
  return (
    <aside
      className={clsx(
        "flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-all",
        collapsed ? "w-[84px]" : "w-[260px]"
      )}
    >
      <div className="flex h-24 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-10 w-10 shrink-0" />
          {!collapsed && (
            <div>
              <h1 className="text-xl font-semibold leading-tight text-slate-950">Visual Bookmark</h1>
              <p className="text-xs font-medium text-slate-500">Boards</p>
            </div>
          )}
        </div>
        <button
          type="button"
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={clsx("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {boards.map((board, index) => {
          const Icon = boardIcons[index % boardIcons.length];
          const selected = board.id === selectedBoardId;

          return (
            <div
              key={board.id}
              className={clsx(
                "group flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-left transition",
                selected ? "border-blue-100 bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => onSelectBoard(board.id)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate font-medium">{board.name}</span>}
              </button>
              {!collapsed && (
                <div className="flex opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    className="rounded p-1 text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => onRenameBoard(board)}
                  >
                    <span className="sr-only">Rename {board.name}</span>
                    ...
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 text-slate-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => onDeleteBoard(board)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {board.name}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <button
          type="button"
          className={clsx(
            "mt-4 flex w-full items-center gap-3 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-slate-600 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
            collapsed && "justify-center"
          )}
          onClick={onCreateBoard}
        >
          <Plus className="h-5 w-5" />
          {!collapsed && <span className="font-medium">New Board</span>}
        </button>
      </nav>

    </aside>
  );
}
