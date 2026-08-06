import { normalizeUrl } from "@/lib/urls";

const MAX_HTML_BYTES = 200_000;
const FAVICON_TIMEOUT_MS = 7000;

type LinkCandidate = {
  href: string;
  score: number;
};

export function fallbackFaviconUrl(pageUrl: string) {
  const normalizedUrl = normalizeUrl(pageUrl);
  const parsed = new URL(normalizedUrl);

  return new URL("/favicon.ico", parsed.origin).toString();
}

export function extractFaviconUrl(pageUrl: string, html: string) {
  const normalizedUrl = normalizeUrl(pageUrl);
  const candidates: LinkCandidate[] = [];
  const linkTagPattern = /<link\s+[^>]*>/gi;

  for (const match of html.matchAll(linkTagPattern)) {
    const attributes = parseAttributes(match[0]);
    const rel = attributes.get("rel")?.toLowerCase();
    const href = attributes.get("href");

    if (!rel || !href || href.startsWith("data:")) {
      continue;
    }

    const relTokens = rel.split(/\s+/);
    if (!relTokens.some((token) => token.includes("icon"))) {
      continue;
    }

    const resolvedUrl = resolveHttpUrl(href, normalizedUrl);
    if (!resolvedUrl) {
      continue;
    }

    candidates.push({
      href: resolvedUrl,
      score: scoreIconLink(relTokens, attributes)
    });
  }

  candidates.sort((left, right) => right.score - left.score);

  return candidates[0]?.href ?? null;
}

export async function resolveFaviconUrl(pageUrl: string) {
  const normalizedUrl = normalizeUrl(pageUrl);
  const fallbackUrl = fallbackFaviconUrl(normalizedUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FAVICON_TIMEOUT_MS);

  try {
    const response = await fetch(normalizedUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Visual Bookmark favicon resolver"
      },
      signal: controller.signal
    });

    if (!response.ok || !isHtmlResponse(response)) {
      return fallbackUrl;
    }

    const html = await readLimitedText(response);
    return extractFaviconUrl(response.url || normalizedUrl, html) ?? fallbackUrl;
  } catch {
    return fallbackUrl;
  } finally {
    clearTimeout(timeout);
  }
}

function parseAttributes(tag: string) {
  const attributes = new Map<string, string>();
  const attributePattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;

  for (const match of tag.matchAll(attributePattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? "");
  }

  return attributes;
}

function resolveHttpUrl(value: string, baseUrl: string) {
  try {
    const resolved = new URL(value, baseUrl);
    return resolved.protocol === "http:" || resolved.protocol === "https:" ? resolved.toString() : null;
  } catch {
    return null;
  }
}

function scoreIconLink(relTokens: string[], attributes: Map<string, string>) {
  let score = 10;
  const rel = relTokens.join(" ");
  const type = attributes.get("type")?.toLowerCase() ?? "";
  const sizes = attributes.get("sizes")?.toLowerCase() ?? "";

  if (relTokens.includes("icon")) {
    score += 30;
  }

  if (rel.includes("shortcut icon")) {
    score += 20;
  }

  if (relTokens.includes("apple-touch-icon")) {
    score += 15;
  }

  if (type === "image/svg+xml" || sizes === "any") {
    score += 10;
  }

  const sizeMatch = sizes.match(/(\d+)x(\d+)/);
  if (sizeMatch) {
    score += Math.min(Number(sizeMatch[1]), 128) / 8;
  }

  return score;
}

function isHtmlResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  return !contentType || contentType.includes("text/html") || contentType.includes("application/xhtml+xml");
}

async function readLimitedText(response: Response) {
  if (!response.body) {
    return response.text();
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";

  try {
    while (bytesRead < MAX_HTML_BYTES) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      bytesRead += value.byteLength;
      text += decoder.decode(value, { stream: bytesRead < MAX_HTML_BYTES });
    }
  } finally {
    reader.releaseLock();
  }

  return text + decoder.decode();
}
