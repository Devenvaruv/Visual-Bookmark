import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookmarkPositionSchema } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const parsed = bookmarkPositionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid bookmark position." }, { status: 400 });
  }

  try {
    const bookmark = await db.bookmark.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json({ bookmark });
  } catch {
    return NextResponse.json({ error: "Failed to update bookmark." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await db.bookmark.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete bookmark." }, { status: 500 });
  }
}

