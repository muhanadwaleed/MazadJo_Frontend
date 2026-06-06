import { getLocale, getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import type { AuctionListItem } from "@mazad/api";
import { formatMoney } from "@/lib/format";
import { normalizeMediaUrl } from "@/lib/media-url";
import { AuctionStatusBadge } from "@/components/auctions/auction-status-badge";
import { ButtonLink } from "@/components/ui/button-link";
import { AuctionCardShell, CountdownTimer } from "@mazad/ui";

export async function AuctionCard({ auction }: { auction: AuctionListItem }) {
  const locale = await getLocale();
  const t = await getTranslations("auctions");
  const tCommon = await getTranslations("common");

  const isLive = auction.status === "active";

  return (
    <AuctionCardShell
      title={auction.title}
      auctionNumber={auction.auction_number}
      imageUrl={normalizeMediaUrl(auction.primary_media_url)}
      fallbackImageUrl="/logo.png"
      statusBadge={<AuctionStatusBadge status={auction.status} />}
      isLive={isLive}
      currentBidLabel={t("currentBid")}
      currentBid={formatMoney(auction.current_price, locale)}
      startingPriceLabel={t("startingPrice")}
      startingPrice={formatMoney(auction.start_price, locale)}
      bidCountText={t("bidCount", { count: auction.participants_count })}
      timeRemaining={
        isLive ? (
          <CountdownTimer
            endsAt={auction.ends_at}
            labels={{
              days: t("countdown.days"),
              hours: t("countdown.hours"),
              minutes: t("countdown.minutes"),
              seconds: t("countdown.seconds"),
            }}
          />
        ) : undefined
      }
      footer={
        <>
          <ButtonLink href={routes.auction(auction.id)} className="flex-1">
            {tCommon("view")}
          </ButtonLink>
          <ButtonLink
            href={routes.auctionBids(auction.id)}
            variant="outline"
            className="flex-1"
          >
            {t("bids")}
          </ButtonLink>
        </>
      }
    />
  );
}
