/** Same-origin path for media serve URLs (Next.js `/api` proxy). */
export function normalizeMediaUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    if (parsed.pathname.startsWith("/api/")) {
      return parsed.pathname;
    }
  } catch {
    if (url.startsWith("/api/")) return url;
  }
  return url;
}

export function extensionsAccept(extensions: string[] | undefined): string {
  if (!extensions?.length) return "image/*";
  return extensions.map((ext) => (ext.startsWith(".") ? ext : `.${ext}`)).join(",");
}
