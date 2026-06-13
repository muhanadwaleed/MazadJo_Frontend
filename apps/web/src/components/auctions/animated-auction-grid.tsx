import type { AuctionListItem } from "@mazad/api";

import { AuctionCard } from "@/components/auctions/auction-card";
import { WatchlistIdsProvider } from "@/components/auctions/watchlist-ids-provider";
import {
  MotionStaggerGrid,
  MotionStaggerItem,
} from "@/components/common/motion-stagger";

type AnimatedAuctionGridProps = {
  auctions: AuctionListItem[];
  /** Remount motion when filters/search change so cards are not stuck invisible. */
  viewKey?: string;
};

export function AnimatedAuctionGrid({
  auctions,
  viewKey = "default",
}: AnimatedAuctionGridProps) {
  return (
    <WatchlistIdsProvider>
      <MotionStaggerGrid
        resetKey={viewKey}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {auctions.map((auction) => (
          <MotionStaggerItem key={auction.id} className="h-full">
            <AuctionCard auction={auction} />
          </MotionStaggerItem>
        ))}
      </MotionStaggerGrid>
    </WatchlistIdsProvider>
  );
}
