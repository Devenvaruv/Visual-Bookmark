"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type Node,
  type OnNodeDrag,
  type NodeTypes,
  useEdgesState,
  useNodesState
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { findContainingGroup, snapPoint, toRelativePosition } from "@/lib/canvas-geometry";
import type { BookmarkRecord, CanvasPayload, GroupRecord, Point } from "@/types/canvas";
import { BookmarkNode, type BookmarkNodeType } from "@/components/canvas/bookmark-node";
import { GroupNode, type GroupNodeType } from "@/components/canvas/group-node";

type CanvasNode = BookmarkNodeType | GroupNodeType;

type Props = {
  data: CanvasPayload;
  onChanged: () => void;
  onError: (message: string) => void;
};

const nodeTypes: NodeTypes = {
  bookmark: BookmarkNode,
  group: GroupNode
};

export function BookmarkCanvas({ data, onChanged, onError }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CanvasNode>([]);
  const [edges, , onEdgesChange] = useEdgesState([]);
  const groupsRef = useRef<GroupRecord[]>(data.groups);

  const callbacks = useMemo(
    () => ({
      onOpen: (bookmark: BookmarkRecord) => {
        window.open(bookmark.url, "_blank", "noopener,noreferrer");
      },
      onDelete: async (bookmark: BookmarkRecord) => {
        await requestJson(`/api/bookmarks/${bookmark.id}`, { method: "DELETE" }, onError);
        onChanged();
      },
      onRenameGroup: async (group: GroupRecord) => {
        const name = window.prompt("Rename group", group.name)?.trim();
        if (!name || name === group.name) {
          return;
        }

        await requestJson(`/api/groups/${group.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        }, onError);
        onChanged();
      },
      onDeleteGroup: async (group: GroupRecord) => {
        if (!window.confirm(`Delete "${group.name}"? Bookmarks inside it will move back to the canvas.`)) {
          return;
        }

        await requestJson(`/api/groups/${group.id}`, { method: "DELETE" }, onError);
        onChanged();
      },
      onResizeGroup: async (groupId: string, width: number, height: number) => {
        groupsRef.current = groupsRef.current.map((group) =>
          group.id === groupId ? { ...group, width, height } : group
        );
        setNodes((current) =>
          current.map((item) =>
            item.id === groupId && item.type === "group"
              ? {
                  ...item,
                  width,
                  height,
                  style: { ...item.style, width, height },
                  data: { ...item.data, width, height }
                }
              : item
          )
        );
        await requestJson(`/api/groups/${groupId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ width, height })
        }, onError);
      }
    }),
    [onChanged, onError, setNodes]
  );

  useEffect(() => {
    groupsRef.current = data.groups;
    const nextNodes: CanvasNode[] = [
      ...data.groups.map<GroupNodeType>((group) => ({
        id: group.id,
        type: "group",
        position: { x: group.positionX, y: group.positionY },
        width: group.width,
        height: group.height,
        style: { width: group.width, height: group.height },
        data: {
          ...group,
          onRename: callbacks.onRenameGroup,
          onDelete: callbacks.onDeleteGroup,
          onResize: callbacks.onResizeGroup
        }
      })),
      ...data.bookmarks.map<BookmarkNodeType>((bookmark) => ({
        id: bookmark.id,
        type: "bookmark",
        position: { x: bookmark.positionX, y: bookmark.positionY },
        parentId: bookmark.groupId ?? undefined,
        width: bookmark.width,
        height: bookmark.height,
        data: {
          ...bookmark,
          onOpen: callbacks.onOpen,
          onDelete: callbacks.onDelete
        }
      }))
    ];

    setNodes(nextNodes);
  }, [callbacks, data, setNodes]);

  const handleNodeDragStop = useCallback<OnNodeDrag>(
    async (_event, node) => {
      const canvasNode = node as Node;
      const snapped = snapPoint(canvasNode.position);

      if (canvasNode.type === "group") {
        groupsRef.current = groupsRef.current.map((group) =>
          group.id === canvasNode.id ? { ...group, positionX: snapped.x, positionY: snapped.y } : group
        );
        setNodes((current) =>
          current.map((item) =>
            item.id === canvasNode.id && item.type === "group"
              ? {
                  ...item,
                  position: snapped,
                  data: {
                    ...item.data,
                    positionX: snapped.x,
                    positionY: snapped.y
                  }
                }
              : item
          )
        );
        await requestJson(`/api/groups/${canvasNode.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ positionX: snapped.x, positionY: snapped.y })
        }, onError);
        return;
      }

      if (canvasNode.type !== "bookmark") {
        return;
      }

      const previousParent = canvasNode.parentId ?? null;
      const groups = groupsRef.current;
      const absolutePosition = getAbsolutePosition(canvasNode, groups);
      const size = {
        width: Number(canvasNode.width ?? 180),
        height: Number(canvasNode.height ?? 96)
      };
      const targetGroup = findContainingGroup(absolutePosition, size, groups);
      const nextPosition = targetGroup ? toRelativePosition(absolutePosition, targetGroup) : snapPoint(absolutePosition);
      const nextGroupId = targetGroup?.id ?? null;

      setNodes((current) =>
        current.map((item) =>
          item.id === canvasNode.id && item.type === "bookmark"
            ? {
                ...item,
                parentId: nextGroupId ?? undefined,
                position: nextPosition,
                data: {
                  ...item.data,
                  groupId: nextGroupId,
                  positionX: nextPosition.x,
                  positionY: nextPosition.y
                }
              }
            : item
        )
      );

      if (previousParent !== nextGroupId || nextPosition.x !== canvasNode.position.x || nextPosition.y !== canvasNode.position.y) {
        await requestJson(`/api/bookmarks/${canvasNode.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId: nextGroupId,
            positionX: nextPosition.x,
            positionY: nextPosition.y
          })
        }, onError);
      }
    },
    [onError, setNodes]
  );

  return (
    <div className="visual-grid h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        snapToGrid
        snapGrid={[20, 20]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.35}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        <Background color="#cbd5e1" gap={24} size={1} variant={BackgroundVariant.Lines} />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
}

function getAbsolutePosition(node: Node, groups: GroupRecord[]): Point {
  if (!node.parentId) {
    return snapPoint(node.position);
  }

  const parent = groups.find((group) => group.id === node.parentId);
  if (!parent) {
    return snapPoint(node.position);
  }

  return snapPoint({
    x: parent.positionX + node.position.x,
    y: parent.positionY + node.position.y
  });
}

async function requestJson(path: string, init: RequestInit, onError: (message: string) => void) {
  const response = await fetch(path, init);
  const payload = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    const message = payload.error ?? "Request failed.";
    onError(message);
    throw new Error(message);
  }

  return payload;
}
