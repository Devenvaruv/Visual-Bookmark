import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveFaviconUrl } from "@/lib/favicons";

const faviconRequestSchema = z.object({
  url: z.string().trim().min(1, "URL is required.")
});

export async function POST(request: Request) {
  const parsed = faviconRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid URL." }, { status: 400 });
  }

  try {
    const url = await resolveFaviconUrl(parsed.data.url);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract favicon." },
      { status: 400 }
    );
  }
}
