const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const COMMON_SECOND_LEVEL_DOMAINS = new Set(["ac", "co", "com", "edu", "gov", "net", "org"]);

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

export function deriveBookmarkTitleFromUrl(value: string) {
  try {
    const hostname = new URL(normalizeUrl(value)).hostname.toLowerCase().replace(/^www\./, "");
    const labels = hostname.split(".").filter(Boolean);

    if (labels.length === 0) {
      return "";
    }

    if (labels.length === 1) {
      return cleanDomainLabel(labels[0]);
    }

    const topLevelDomain = labels.at(-1) ?? "";
    const secondLevelDomain = labels.at(-2) ?? "";
    const domainLabel =
      labels.length >= 3 && topLevelDomain.length === 2 && COMMON_SECOND_LEVEL_DOMAINS.has(secondLevelDomain)
        ? labels.at(-3)
        : secondLevelDomain;

    return cleanDomainLabel(domainLabel ?? "");
  } catch {
    return "";
  }
}

function cleanDomainLabel(value: string) {
  return value.replace(/[-_]+/g, " ").trim();
}
