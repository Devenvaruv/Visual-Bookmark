import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { createBoardSchema } from "@/lib/validation";

export async function GET() {
  const boards = await db.board.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, order: true }
  });

  return NextResponse.json({ boards });
}

export async function POST(request: Request) {
  const parsed = createBoardSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid board." }, { status: 400 });
  }

  try {
    const maxBoard = await db.board.findFirst({ orderBy: { order: "desc" } });
    const board = await db.board.create({
      data: {
        name: parsed.data.name,
        order: (maxBoard?.order ?? -1) + 1
      },
      select: { id: true, name: true, order: true }
    });

    return NextResponse.json({ board }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "A board with that name already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create board." }, { status: 500 });
  }
}

