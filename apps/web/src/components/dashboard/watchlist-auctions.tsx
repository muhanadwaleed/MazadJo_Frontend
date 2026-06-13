"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { auctionsService } from "@mazad/api";
import type { AuctionListItem } from "@mazad/api";
import { routes } from "@/config/routes";
import { resolveAuctionBidderCountClient } from "@/lib/auction-bidder-count";
import { WatchlistAuctionCard } from "@/components/dashboard/watchlist-auction-card";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingGrid } from "@/components/common/loading-grid";
import { ButtonLink } from "@/components/ui/button-link";

type WatchlistAuctionEntry = {
  auction: AuctionListItem;
  bidderCount: number;
};

export function WatchlistAuctions() {
  const t = useTranslations("watchlist");
  const tErrors = useTranslations("errors");
  const tHome = useTranslations("home");
  const [entries, setEntries] = useState<WatchlistAuctionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    return auctionsService
      .listWatchlistClient({ page_size: 50 })
      .then(async (data) => {
        const auctions = data.results.map((entry) => entry.auction);
        const bidderCounts = await Promise.all(
          auctions.map((auction) => resolveAuctionBidderCountClient(auction))
        );
        setEntries(
          auctions.map((auction, index) => ({
            auction,
            bidderCount: bidderCounts[index],
          }))
        );
      })
      .catch(() => setError(t("loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <LoadingGrid count={6} />;
  }

  if (error) {
    return <ErrorState title={tErrors("genericTitle")} message={error} />;
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        action={
          <ButtonLink href={routes.auctions}>{tHome("browseAuctions")}</ButtonLink>
        }
      />
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(({ auction, bidderCount }) => (
        <li key={auction.id} className="h-full">
          <WatchlistAuctionCard
            auction={auction}
            bidderCount={bidderCount}
            onRemoved={load}
          />
        </li>
      ))}
    </ul>
  );
}
