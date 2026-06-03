"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { auctionsService } from "@mazad/api";
import type { AuctionListItem } from "@mazad/api";
import { routes } from "@/config/routes";
import { SellerListingRow } from "@/components/dashboard/seller-listing-row";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingGrid } from "@/components/common/loading-grid";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mazad/ui";

export function DashboardMyAuctions() {
  const t = useTranslations("dashboard");
  const tErrors = useTranslations("errors");
  const [auctions, setAuctions] = useState<AuctionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    return auctionsService
      .listClient({ mine: true, page_size: 50 })
      .then((data) => setAuctions(data.results))
      .catch(() => setError(t("loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>{t("myAuctions")}</CardTitle>
          <CardDescription>{t("myAuctionsDescription")}</CardDescription>
        </CardHeader>
      </Card>
      {loading ? (
        <LoadingGrid count={3} />
      ) : error ? (
        <ErrorState title={tErrors("genericTitle")} message={error} />
      ) : auctions.length === 0 ? (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <ButtonLink href={routes.listingNew}>{t("createListing")}</ButtonLink>
          }
        />
      ) : (
        <ul className="space-y-4">
          {auctions.map((auction) => (
            <li key={auction.id}>
              <SellerListingRow auction={auction} onUpdated={load} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
