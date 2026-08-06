export type ImageType = "PLACEHOLDER" | "UPLOAD" | "FAVICON";

export type BoardSummary = {
  id: string;
  name: string;
  order: number;
};

export type BookmarkRecord = {
  id: string;
  boardId: string;
  groupId: string | null;
  title: string;
  url: string;
  imageType: ImageType;
  imageValue: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
};

export type GroupRecord = {
  id: string;
  boardId: string;
  name: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  color: string;
};

export type CanvasPayload = {
  groups: GroupRecord[];
  bookmarks: BookmarkRecord[];
};

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};
