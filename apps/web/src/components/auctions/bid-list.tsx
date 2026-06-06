import { getLocale, getTranslations } from "next-intl/server";

import type { PublicBid } from "@mazad/api";
import { formatDateTime, formatMoney } from "@/lib/format";
import { EmptyState } from "@/components/common/empty-state";

export async function BidList({ bids }: { bids: PublicBid[] }) {
  const locale = await getLocale();
  const t = await getTranslations("bids");

  if (bids.length === 0) {
    return (
      <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
    );
  }

  return (
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
  );
}
