"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import type { PublicBid } from "@mazad/api";
import { ApiError, auctionsService } from "@mazad/api";
import { formatDateTime, formatMoney } from "@/lib/format";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@mazad/ui";

type BidListWithPaginationProps = {
  auctionId: string;
  initialBids: PublicBid[];
  initialNext: string | null;
  locale: string;
};

function extractCursor(nextUrl: string | null): string | undefined {
  if (!nextUrl) return undefined;
  try {
    return new URL(nextUrl, "http://localhost").searchParams.get("cursor") ?? undefined;
  } catch {
    return undefined;
  }
}

export function BidListWithPagination({
  auctionId,
  initialBids,
  initialNext,
  locale,
}: BidListWithPaginationProps) {
  const t = useTranslations("bids");
  const [bids, setBids] = useState(initialBids);
  const [nextCursor, setNextCursor] = useState(initialNext);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!nextCursor || loading) return;
    setLoading(true);
    try {
      const cursor = extractCursor(nextCursor);
      const page = await auctionsService.bidsClient(auctionId, {
        cursor,
        page_size: 50,
      });
      setBids((current) => [...current, ...page.results]);
      setNextCursor(page.next);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : t("loadError"));
    } finally {
      setLoading(false);
    }
  }

  if (bids.length === 0) {
    return (
      <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
    );
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-separator overflow-hidden rounded-2xl border border-separator/60 bg-card">
        {bids.map((bid, index) => (
          <li
            key={bid.id}
            className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-mazad-primary/10 text-sm font-bold text-mazad-primary">
                {bids.length - index}
              </span>
              <div>
                <p className="text-lg font-bold text-navy">
                  {formatMoney(bid.amount, locale)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("bidder")} {bid.bidder}
                </p>
              </div>
            </div>
            <time className="text-sm text-muted-foreground" dateTime={bid.timestamp}>
              {formatDateTime(bid.timestamp, locale)}
            </time>
          </li>
        ))}
      </ul>
      {nextCursor ? (
        <div className="flex justify-center">
          <Button type="button" variant="outline" disabled={loading} onClick={loadMore}>
            {loading ? t("loadingMore") : t("loadMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
