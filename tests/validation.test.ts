import { describe, expect, it } from "vitest";
import { bookmarkFormSchema } from "@/lib/validation";

describe("bookmark creation validation", () => {
  it("accepts a valid placeholder bookmark and normalizes the URL", () => {
    const parsed = bookmarkFormSchema.safeParse({
      boardId: "board-1",
      title: "Docs",
      url: "example.com/docs",
      imageType: "PLACEHOLDER",
      imageValue: "document"
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.url).toBe("https://example.com/docs");
    }
  });

  it("rejects an empty title", () => {
    const parsed = bookmarkFormSchema.safeParse({
      boardId: "board-1",
      title: "",
      url: "example.com",
      imageType: "PLACEHOLDER",
      imageValue: "video"
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts a bookmark that uses a favicon image", () => {
    const parsed = bookmarkFormSchema.safeParse({
      boardId: "board-1",
      title: "Example",
      url: "example.com",
      imageType: "FAVICON",
      imageValue: "https://example.com/favicon.ico"
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects unsafe favicon image URLs", () => {
    const parsed = bookmarkFormSchema.safeParse({
      boardId: "board-1",
      title: "Example",
      url: "example.com",
      imageType: "FAVICON",
      imageValue: "javascript:alert(1)"
    });

    expect(parsed.success).toBe(false);
  });
});
