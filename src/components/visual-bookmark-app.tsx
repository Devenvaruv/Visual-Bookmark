"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookmarkPanel } from "@/components/bookmarks/bookmark-panel";
import { BookmarkCanvas } from "@/components/canvas/bookmark-canvas";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopToolbar } from "@/components/layout/top-toolbar";
import type { BoardSummary, CanvasPayload } from "@/types/canvas";

const EMPTY_CANVAS: CanvasPayload = {
  groups: [],
  bookmarks: []
};

export function VisualBookmarkApp() {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [canvasData, setCanvasData] = useState<CanvasPayload>(EMPTY_CANVAS);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canvasLoading, setCanvasLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedBoard = useMemo(
    () => boards.find((board) => board.id === selectedBoardId) ?? null,
    [boards, selectedBoardId]
  );

  const showError = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(null), 4_000);
  }, []);

  const loadBoards = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await requestJson<{ boards: BoardSummary[] }>("/api/boards");
      setBoards(payload.boards);
      const stored = window.localStorage.getItem("visual-bookmark-board-id");
      const nextSelected = payload.boards.some((board) => board.id === stored)
        ? stored
        : payload.boards[0]?.id ?? null;
      setSelectedBoardId(nextSelected);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to load boards.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const loadCanvas = useCallback(
    async (boardId: string | null = selectedBoardId) => {
      if (!boardId) {
        setCanvasData(EMPTY_CANVAS);
        return;
      }

      setCanvasLoading(true);
      try {
        const payload = await requestJson<CanvasPayload>(`/api/boards/${boardId}/canvas`);
        setCanvasData(payload);
      } catch (error) {
        showError(error instanceof Error ? error.message : "Failed to load canvas.");
      } finally {
        setCanvasLoading(false);
      }
    },
    [selectedBoardId, showError]
  );

  useEffect(() => {
    void loadBoards();
  }, [loadBoards]);

  useEffect(() => {
    if (selectedBoardId) {
      window.localStorage.setItem("visual-bookmark-board-id", selectedBoardId);
    }
    void loadCanvas(selectedBoardId);
  }, [loadCanvas, selectedBoardId]);

  async function createBoard() {
    const name = window.prompt("Board name")?.trim();
    if (!name) {
      return;
    }

    try {
      const payload = await requestJson<{ board: BoardSummary }>("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      setBoards((current) => [...current, payload.board]);
      setSelectedBoardId(payload.board.id);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to create board.");
    }
  }

  async function renameBoard(board: BoardSummary) {
    const name = window.prompt("Rename board", board.name)?.trim();
    if (!name || name === board.name) {
      return;
    }

    try {
      const payload = await requestJson<{ board: BoardSummary }>(`/api/boards/${board.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      setBoards((current) => current.map((item) => (item.id === board.id ? payload.board : item)));
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to rename board.");
    }
  }

  async function deleteBoard(board: BoardSummary) {
    if (!window.confirm(`Delete "${board.name}" and all of its bookmarks and groups?`)) {
      return;
    }

    try {
      await requestJson(`/api/boards/${board.id}`, { method: "DELETE" });
      const nextBoards = boards.filter((item) => item.id !== board.id);
      setBoards(nextBoards);
      if (selectedBoardId === board.id) {
        setSelectedBoardId(nextBoards[0]?.id ?? null);
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to delete board.");
    }
  }

  async function createGroup() {
    if (!selectedBoardId) {
      showError("Select a board first.");
      return;
    }

    const name = window.prompt("Group name")?.trim();
    if (!name) {
      return;
    }

    const offset = canvasData.groups.length * 40;
    try {
      await requestJson("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: selectedBoardId,
          name,
          positionX: 80 + offset,
          positionY: 80 + offset,
          width: 440,
          height: 280,
          color: pickGroupColor(canvasData.groups.length)
        })
      });
      await loadCanvas(selectedBoardId);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to create group.");
    }
  }

  return (
    <main className="flex h-screen overflow-hidden bg-white">
      <AppSidebar
        boards={boards}
        selectedBoardId={selectedBoardId}
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed((value) => !value)}
        onSelectBoard={setSelectedBoardId}
        onCreateBoard={() => void createBoard()}
        onRenameBoard={(board) => void renameBoard(board)}
        onDeleteBoard={(board) => void deleteBoard(board)}
      />

      <section className="relative flex min-w-0 flex-1 flex-col">
        <TopToolbar onNewBookmark={() => setPanelOpen(true)} onNewGroup={() => void createGroup()} />

        <div className="relative min-h-0 flex-1">
          {loading || canvasLoading ? (
            <div className="flex h-full items-center justify-center text-slate-500">Loading...</div>
          ) : selectedBoard ? (
            <BookmarkCanvas data={canvasData} onChanged={() => void loadCanvas()} onError={showError} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => void createBoard()}
              >
                Create your first board
              </button>
            </div>
          )}

          <BookmarkPanel
            open={panelOpen}
            boardId={selectedBoardId}
            onClose={() => setPanelOpen(false)}
            onCreated={() => void loadCanvas(selectedBoardId)}
            onError={showError}
          />

          {message && (
            <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-panel">
              {message}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload;
}

function pickGroupColor(index: number) {
  const colors = ["#eef6ff", "#effaf5", "#f8f5ff", "#fff7ed", "#f8fafc"];
  return colors[index % colors.length];
}

