/**
 * Media serve URL as returned by the backend. The browser fetches it directly,
 * so absolute backend URLs are kept as-is; only empty values become null.
 */
export function normalizeMediaUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  return url;
}

export function extensionsAccept(extensions: string[] | undefined): string {
  if (!extensions?.length) return "image/*";
  return extensions.map((ext) => (ext.startsWith(".") ? ext : `.${ext}`)).join(",");
}
