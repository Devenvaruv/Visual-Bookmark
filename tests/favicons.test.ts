import { describe, expect, it } from "vitest";
import { extractFaviconUrl, fallbackFaviconUrl } from "@/lib/favicons";

describe("favicon handling", () => {
  it("extracts an absolute favicon URL from a relative icon link", () => {
    const favicon = extractFaviconUrl(
      "https://example.com/docs",
      '<html><head><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"></head></html>'
    );

    expect(favicon).toBe("https://example.com/assets/favicon.svg");
  });

  it("prefers a higher quality icon declaration", () => {
    const favicon = extractFaviconUrl(
      "https://example.com",
      [
        '<link rel="icon" href="/small.png" sizes="16x16">',
        '<link rel="icon" href="/large.png" sizes="128x128">'
      ].join("")
    );

    expect(favicon).toBe("https://example.com/large.png");
  });

  it("builds a favicon.ico fallback from the page origin", () => {
    expect(fallbackFaviconUrl("example.com/docs")).toBe("https://example.com/favicon.ico");
  });
});
