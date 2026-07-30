import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const [groups, bookmarks] = await Promise.all([
    db.bookmarkGroup.findMany({
      where: { boardId: id },
      orderBy: { createdAt: "asc" }
    }),
    db.bookmark.findMany({
      where: { boardId: id },
      orderBy: { createdAt: "asc" }
    })
  ]);

  return NextResponse.json({ groups, bookmarks });
}

