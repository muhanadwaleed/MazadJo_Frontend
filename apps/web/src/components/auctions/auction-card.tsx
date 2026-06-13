import { getLocale, getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import type { AuctionListItem } from "@mazad/api";
import { resolveAuctionBidderCount } from "@/lib/auction-bidder-count";
import { formatMoney } from "@/lib/format";
import { normalizeMediaUrl } from "@/lib/media-url";
import { AuctionStatusBadge } from "@/components/auctions/auction-status-badge";
import { AuctionWatchlistIconButton } from "@/components/auctions/auction-watchlist-icon-button";
import { ButtonLink } from "@/components/ui/button-link";
import { CountdownTimer } from "@mazad/ui";
import { AuctionCardShellLink } from "@/components/auctions/auction-card-shell-link";

export async function AuctionCard({ auction }: { auction: AuctionListItem }) {
  const locale = await getLocale();
  const t = await getTranslations("auctions");
  const tCommon = await getTranslations("common");

  const isLive = auction.status === "active";
  const isScheduled = auction.status === "scheduled";
  const isEnded =
    auction.status === "ended" || auction.status === "ended_without_bids";
  const bidderCount = await resolveAuctionBidderCount(auction);

  return (
    <AuctionCardShellLink
      href={routes.auction(auction.id)}
      title={auction.title}
      auctionNumber={auction.auction_number}
      imageUrl={normalizeMediaUrl(auction.primary_media_url)}
      fallbackImageUrl="/logo.png"
      statusBadge={<AuctionStatusBadge status={auction.status} />}
      isLive={isLive}
      imageAction={<AuctionWatchlistIconButton auctionId={auction.id} />}
      currentBidLabel={t("currentBid")}
      currentBid={formatMoney(auction.current_price, locale)}
      startingPriceLabel={t("startingPrice")}
      startingPrice={formatMoney(auction.start_price, locale)}
      bidCountText={t("bidCount", { count: bidderCount })}
      timeRemaining={
        isLive && auction.ends_at ? (
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
        isLive ? (
          <>
            <ButtonLink href={routes.auction(auction.id)} className="flex-1">
              {t("placeBidCta")}
            </ButtonLink>
            <ButtonLink
              href={routes.auction(auction.id)}
              variant="outline"
              className="flex-1"
            >
              {tCommon("view")}
            </ButtonLink>
          </>
        ) : isScheduled ? (
          <ButtonLink href={routes.auction(auction.id)} className="w-full">
            {t("viewListing")}
          </ButtonLink>
        ) : isEnded ? (
          <>
            <ButtonLink href={routes.auction(auction.id)} className="flex-1">
              {t("viewResults")}
            </ButtonLink>
            <ButtonLink
              href={routes.auctionBids(auction.id)}
              variant="outline"
              className="flex-1"
            >
              {t("bids")}
            </ButtonLink>
          </>
        ) : (
          <ButtonLink href={routes.auction(auction.id)} className="w-full">
            {tCommon("view")}
          </ButtonLink>
        )
      }
    />
  );
}
