import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deriveBookmarkTitleFromUrl } from "@/lib/urls";
import { bookmarkFormSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = bookmarkFormSchema.safeParse({
    ...body,
    title:
      typeof body.title === "string" && body.title.trim()
        ? body.title
        : typeof body.url === "string"
          ? deriveBookmarkTitleFromUrl(body.url)
          : body.title
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid bookmark." }, { status: 400 });
  }

  try {
    const bookmarkCount = await db.bookmark.count({ where: { boardId: parsed.data.boardId } });
    const bookmark = await db.bookmark.create({
      data: {
        ...parsed.data,
        positionX: 80 + (bookmarkCount % 4) * 200,
        positionY: 80 + Math.floor(bookmarkCount / 4) * 120,
        width: 180,
        height: 96
      }
    });

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create bookmark." }, { status: 500 });
  }
}
