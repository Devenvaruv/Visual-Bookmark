import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createGroupSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = createGroupSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid group." }, { status: 400 });
  }

  try {
    const group = await db.bookmarkGroup.create({ data: parsed.data });
    return NextResponse.json({ group }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create group." }, { status: 500 });
  }
}

