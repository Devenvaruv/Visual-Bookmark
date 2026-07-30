import { describe, expect, it } from "vitest";
import {
  findContainingGroup,
  moveGroupWithChildren,
  snapPoint,
  toCanvasPosition,
  toRelativePosition
} from "@/lib/canvas-geometry";
import type { GroupRecord } from "@/types/canvas";

const group: GroupRecord = {
  id: "group-1",
  boardId: "board-1",
  name: "Pipeline",
  positionX: 100,
  positionY: 80,
  width: 400,
  height: 260,
  color: "#eef6ff"
};

describe("canvas geometry", () => {
  it("snaps coordinates to the grid", () => {
    expect(snapPoint({ x: 37, y: 53 })).toEqual({ x: 40, y: 60 });
  });

  it("converts a bookmark into group-relative coordinates", () => {
    expect(toRelativePosition({ x: 260, y: 200 }, group)).toEqual({ x: 160, y: 120 });
  });

  it("converts a bookmark out to canvas coordinates", () => {
    expect(toCanvasPosition({ x: 160, y: 120 }, group)).toEqual({ x: 260, y: 200 });
  });

  it("detects moving a bookmark into a group", () => {
    expect(findContainingGroup({ x: 220, y: 160 }, { width: 180, height: 96 }, [group])?.id).toBe("group-1");
  });

  it("detects moving a bookmark out of a group", () => {
    expect(findContainingGroup({ x: 560, y: 400 }, { width: 180, height: 96 }, [group])).toBeNull();
  });

  it("computes child movement when a group moves", () => {
    const moved = moveGroupWithChildren(
      [{ positionX: 20, positionY: 40, title: "Docs" }],
      { x: 100, y: 80 },
      { x: 140, y: 120 }
    );

    expect(moved[0]).toMatchObject({ positionX: 60, positionY: 80 });
  });
});

