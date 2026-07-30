"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Folder,
  Globe2,
  ImageIcon,
  Mail,
  MessageSquareText,
  NotebookTabs,
  Search,
  Video
} from "lucide-react";
import type { ComponentType } from "react";

export type PlaceholderId =
  | "video"
  | "analytics"
  | "calendar"
  | "image"
  | "notes"
  | "email"
  | "document"
  | "briefcase"
  | "search"
  | "folder"
  | "globe"
  | "chat";

export type PlaceholderOption = {
  id: PlaceholderId;
  label: string;
  bg: string;
  fg: string;
  Icon: ComponentType<{ className?: string }>;
};

export const placeholders: PlaceholderOption[] = [
  { id: "video", label: "Video", bg: "bg-blue-50", fg: "text-blue-600", Icon: Video },
  { id: "analytics", label: "Analytics", bg: "bg-emerald-50", fg: "text-emerald-600", Icon: BarChart3 },
  { id: "calendar", label: "Calendar", bg: "bg-violet-50", fg: "text-violet-600", Icon: CalendarDays },
  { id: "image", label: "Image", bg: "bg-orange-50", fg: "text-orange-500", Icon: ImageIcon },
  { id: "notes", label: "Notes", bg: "bg-amber-50", fg: "text-amber-500", Icon: NotebookTabs },
  { id: "email", label: "Email", bg: "bg-blue-50", fg: "text-blue-600", Icon: Mail },
  { id: "document", label: "Document", bg: "bg-green-50", fg: "text-green-600", Icon: FileText },
  { id: "briefcase", label: "Briefcase", bg: "bg-purple-50", fg: "text-purple-600", Icon: BriefcaseBusiness },
  { id: "search", label: "Search", bg: "bg-orange-50", fg: "text-orange-500", Icon: Search },
  { id: "folder", label: "Folder", bg: "bg-yellow-50", fg: "text-yellow-500", Icon: Folder },
  { id: "globe", label: "Globe", bg: "bg-green-50", fg: "text-green-600", Icon: Globe2 },
  { id: "chat", label: "Chat", bg: "bg-blue-50", fg: "text-blue-600", Icon: MessageSquareText }
];

export function getPlaceholder(id: string) {
  return placeholders.find((placeholder) => placeholder.id === id) ?? placeholders[0];
}

