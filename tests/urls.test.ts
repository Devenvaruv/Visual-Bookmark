import { describe, expect, it } from "vitest";
import { isSafeHttpUrl, normalizeUrl } from "@/lib/urls";

describe("URL handling", () => {
  it("normalizes a URL without a protocol", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com/");
  });

  it("preserves http and https URLs", () => {
    expect(normalizeUrl("http://example.com/path")).toBe("http://example.com/path");
    expect(normalizeUrl("https://example.com/path")).toBe("https://example.com/path");
  });

  it("rejects unsafe protocols", () => {
    expect(() => normalizeUrl("javascript:alert(1)")).toThrow("Only http and https URLs are allowed.");
    expect(isSafeHttpUrl("ftp://example.com")).toBe(false);
  });
});

