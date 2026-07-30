const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("URL is required.");
  }

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const parsed = new URL(withProtocol);

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error("Only http and https URLs are allowed.");
  }

  return parsed.toString();
}

export function isSafeHttpUrl(value: string) {
  try {
    normalizeUrl(value);
    return true;
  } catch {
    return false;
  }
}

