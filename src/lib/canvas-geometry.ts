import type { GroupRecord, Point, Size } from "@/types/canvas";

export const GRID_SIZE = 20;

export function snap(value: number, grid = GRID_SIZE) {
  return Math.round(value / grid) * grid;
}

export function snapPoint(point: Point, grid = GRID_SIZE): Point {
  return {
    x: snap(point.x, grid),
    y: snap(point.y, grid)
  };
}

export function isInsideGroup(point: Point, size: Size, group: GroupRecord) {
  const centerX = point.x + size.width / 2;
  const centerY = point.y + size.height / 2;

  return (
    centerX >= group.positionX &&
    centerX <= group.positionX + group.width &&
    centerY >= group.positionY &&
    centerY <= group.positionY + group.height
  );
}

export function findContainingGroup(point: Point, size: Size, groups: GroupRecord[]) {
  return groups.find((group) => isInsideGroup(point, size, group)) ?? null;
}

export function toRelativePosition(point: Point, group: GroupRecord) {
  return snapPoint({
    x: point.x - group.positionX,
    y: point.y - group.positionY
  });
}

export function toCanvasPosition(point: Point, group: GroupRecord) {
  return snapPoint({
    x: point.x + group.positionX,
    y: point.y + group.positionY
  });
}

export function moveGroupWithChildren<T extends { positionX: number; positionY: number }>(
  children: T[],
  previousGroupPosition: Point,
  nextGroupPosition: Point
) {
  const deltaX = nextGroupPosition.x - previousGroupPosition.x;
  const deltaY = nextGroupPosition.y - previousGroupPosition.y;

  return children.map((child) => ({
    ...child,
    positionX: child.positionX + deltaX,
    positionY: child.positionY + deltaY
  }));
}

