import type { AuctionListItem } from "@mazad/api";

import { AuctionCard } from "@/components/auctions/auction-card";
import {
  MotionStaggerGrid,
  MotionStaggerItem,
} from "@/components/common/motion-stagger";

export function AnimatedAuctionGrid({ auctions }: { auctions: AuctionListItem[] }) {
  return (
    <MotionStaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <MotionStaggerItem key={auction.id} className="h-full">
          <AuctionCard auction={auction} />
        </MotionStaggerItem>
      ))}
    </MotionStaggerGrid>
  );
}
