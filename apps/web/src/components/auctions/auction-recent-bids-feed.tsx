"use client";

import { BidActivityFeedAnimated, type BidActivityItem } from "@mazad/ui";

type AuctionRecentBidsFeedProps = {
  items: BidActivityItem[];
  emptyMessage: string;
};

export function AuctionRecentBidsFeed({
  items,
  emptyMessage,
}: AuctionRecentBidsFeedProps) {
  return (
    <BidActivityFeedAnimated items={items} emptyMessage={emptyMessage} />
  );
}
