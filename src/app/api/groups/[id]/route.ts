import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateGroupSchema } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const parsed = updateGroupSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid group update." }, { status: 400 });
  }

  try {
    const group = await db.bookmarkGroup.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json({ group });
  } catch {
    return NextResponse.json({ error: "Failed to update group." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const group = await db.bookmarkGroup.findUnique({
      where: { id },
      include: { bookmarks: true }
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    await db.$transaction([
      ...group.bookmarks.map((bookmark) =>
        db.bookmark.update({
          where: { id: bookmark.id },
          data: {
            groupId: null,
            positionX: group.positionX + bookmark.positionX,
            positionY: group.positionY + bookmark.positionY
          }
        })
      ),
      db.bookmarkGroup.delete({ where: { id } })
    ]);

    return NextResponse.json({ ok: true, group });
  } catch {
    return NextResponse.json({ error: "Failed to delete group." }, { status: 500 });
  }
}
