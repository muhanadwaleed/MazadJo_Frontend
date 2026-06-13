import { cache } from "react";

import { auctionsService } from "@mazad/api";
import type { AuctionListItem } from "@mazad/api";

type AuctionBidderSource = Pick<
  AuctionListItem,
  "id" | "participants_count" | "current_price" | "start_price"
>;

function hasBidActivity(
  auction: Pick<AuctionListItem, "current_price" | "start_price">
): boolean {
  return Number(auction.current_price) > Number(auction.start_price);
}

function countUniqueBidders(
  bids: { bidder: string }[]
): number {
  if (bids.length === 0) return 0;
  const uniqueBidders = new Set(bids.map((bid) => bid.bidder)).size;
  return uniqueBidders > 0 ? uniqueBidders : bids.length;
}

const fetchBidderCountFromBids = cache(async (auctionId: number): Promise<number> => {
  const bids = await auctionsService.bids(auctionId, { page_size: 100 });
  return countUniqueBidders(bids.results);
});

async function resolveFromBids(
  auction: AuctionBidderSource,
  fetchBids: (id: number) => Promise<{ results: { bidder: string }[] }>
): Promise<number> {
  if (auction.participants_count > 0) {
    return auction.participants_count;
  }

  if (!hasBidActivity(auction)) {
    return 0;
  }

  const bids = await fetchBids(auction.id);
  return countUniqueBidders(bids.results);
}

/** Resolves unique bidder count for list cards when API participants_count is stale. */
export async function resolveAuctionBidderCount(
  auction: AuctionBidderSource
): Promise<number> {
  return resolveFromBids(auction, (id) =>
    auctionsService.bids(id, { page_size: 100 })
  );
}

/** Client-side variant for watchlist and other browser fetches. */
export async function resolveAuctionBidderCountClient(
  auction: AuctionBidderSource
): Promise<number> {
  return resolveFromBids(auction, (id) =>
    auctionsService.bidsClient(id, { page_size: 100 })
  );
}
