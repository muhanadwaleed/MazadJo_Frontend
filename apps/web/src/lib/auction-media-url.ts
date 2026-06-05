import { env } from "@mazad/config";

import { normalizeMediaUrl } from "@/lib/media-url";

/** Absolute serve URL on the Django backend (browser calls it directly). */
export function auctionMediaServePath(auctionId: number, mediaId: number): string {
  const base = env.publicApiUrl.replace(/\/$/, "");
  return `${base}/auctions/${auctionId}/media/${mediaId}/`;
}

export function resolveAuctionMediaPath(
  auctionId: number,
  mediaId: number,
  url?: string | null
): string {
  return normalizeMediaUrl(url) ?? auctionMediaServePath(auctionId, mediaId);
}
