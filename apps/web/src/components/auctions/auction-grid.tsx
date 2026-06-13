import type { AuctionListItem } from "@mazad/api";
import { AuctionCard } from "@/components/auctions/auction-card";
import { WatchlistIdsProvider } from "@/components/auctions/watchlist-ids-provider";

export function AuctionGrid({ auctions }: { auctions: AuctionListItem[] }) {
  return (
    <WatchlistIdsProvider>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {auctions.map((auction) => (
          <li key={auction.id} className="h-full">
            <AuctionCard auction={auction} />
          </li>
        ))}
      </ul>
    </WatchlistIdsProvider>
  );
}
