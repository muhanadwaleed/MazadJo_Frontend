import { getLocale, getTranslations } from "next-intl/server";
import { History } from "lucide-react";

import type { PublicBid } from "@mazad/api";
import { ContentSection } from "@mazad/ui";
import { AuctionRecentBidsFeed } from "@/components/auctions/auction-recent-bids-feed";
import { formatDateTime, formatMoney } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";

type AuctionRecentBidsSectionProps = {
  auctionId: number;
  bids: PublicBid[];
  maxItems?: number;
};

export async function AuctionRecentBidsSection({
  auctionId,
  bids,
  maxItems = 5,
}: AuctionRecentBidsSectionProps) {
  const locale = await getLocale();
  const t = await getTranslations("bids");
  const tDetail = await getTranslations("auctionDetail");

  const items = bids.slice(0, maxItems).map((bid) => ({
    id: bid.id,
    amount: formatMoney(bid.amount, locale),
    bidder: bid.bidder,
    time: formatDateTime(bid.timestamp, locale),
  }));

  return (
    <ContentSection
      title={t("recentBids")}
      description={t("recentBidsDescription")}
      icon={<History className="size-6 stroke-[1.75]" />}
    >
      <AuctionRecentBidsFeed items={items} emptyMessage={t("emptyTitle")} />
      {bids.length > maxItems ? (
        <Link
          href={routes.auctionBids(auctionId)}
          className="mt-4 inline-flex text-sm font-semibold text-mazad-primary transition-opacity duration-200 hover:opacity-85"
        >
          {tDetail("viewAllBids")}
        </Link>
      ) : null}
    </ContentSection>
  );
}
