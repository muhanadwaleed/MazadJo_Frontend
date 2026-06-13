"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { ApiError, auctionsService } from "@mazad/api";
import type { AuctionListItem } from "@mazad/api";
import { routes } from "@/config/routes";
import { formatMoney } from "@/lib/format";
import { normalizeMediaUrl } from "@/lib/media-url";
import { AuctionStatusBadge } from "@/components/auctions/auction-status-badge";
import { ButtonLink } from "@/components/ui/button-link";
import { AuctionCardShell, CountdownTimer } from "@mazad/ui";
import { Button } from "@mazad/ui";

type WatchlistAuctionCardProps = {
  auction: AuctionListItem;
  onRemoved: () => void;
};

export function WatchlistAuctionCard({ auction, onRemoved }: WatchlistAuctionCardProps) {
  const locale = useLocale();
  const t = useTranslations("auctions");
  const tCommon = useTranslations("common");
  const tDetail = useTranslations("auctionDetail");
  const [removing, setRemoving] = useState(false);

  const isLive = auction.status === "active";
  const isScheduled = auction.status === "scheduled";
  const isEnded =
    auction.status === "ended" || auction.status === "ended_without_bids";

  async function removeFromWatchlist() {
    setRemoving(true);
    try {
      await auctionsService.removeFromWatchlist(auction.id);
      toast.success(tDetail("watchlistRemove"));
      onRemoved();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : tDetail("watchlistError")
      );
    } finally {
      setRemoving(false);
    }
  }

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
        <>
          {isLive ? (
            <ButtonLink href={routes.auction(auction.id)} className="flex-1">
              {t("placeBidCta")}
            </ButtonLink>
          ) : isScheduled ? (
            <ButtonLink href={routes.auction(auction.id)} className="flex-1">
              {t("viewListing")}
            </ButtonLink>
          ) : isEnded ? (
            <ButtonLink href={routes.auction(auction.id)} className="flex-1">
              {t("viewResults")}
            </ButtonLink>
          ) : (
            <ButtonLink href={routes.auction(auction.id)} className="flex-1">
              {tCommon("view")}
            </ButtonLink>
          )}
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={removing}
            onClick={removeFromWatchlist}
          >
            {tDetail("watchlistRemove")}
          </Button>
        </>
      }
    />
  );
}
