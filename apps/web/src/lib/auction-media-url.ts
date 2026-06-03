import { normalizeMediaUrl } from "@/lib/media-url";

/** Same-origin serve path (proxied to Django). */
export function auctionMediaServePath(auctionId: number, mediaId: number): string {
  return `/api/v1/auctions/${auctionId}/media/${mediaId}/`;
}

export function resolveAuctionMediaPath(
  auctionId: number,
  mediaId: number,
  url?: string | null
): string {
  return normalizeMediaUrl(url) ?? auctionMediaServePath(auctionId, mediaId);
}
