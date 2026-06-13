"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { ApiError, auctionsService } from "@mazad/api";
import { useAuth } from "@mazad/auth";
import { Button } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

import { useOptionalWatchlistIds } from "@/components/auctions/watchlist-ids-provider";

type AuctionWatchlistIconButtonProps = {
  auctionId: number;
  className?: string;
};

export function AuctionWatchlistIconButton({
  auctionId,
  className,
}: AuctionWatchlistIconButtonProps) {
  const t = useTranslations("auctionDetail");
  const { isAuthenticated } = useAuth();
  const watchlist = useOptionalWatchlistIds();
  const [localOnWatchlist, setLocalOnWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const onWatchlist = watchlist
    ? watchlist.isOnWatchlist(auctionId)
    : localOnWatchlist;

  async function toggleWatchlist(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      toast.error(t("watchlistSignIn"));
      return;
    }

    setLoading(true);
    try {
      if (onWatchlist) {
        await auctionsService.removeFromWatchlist(auctionId);
        watchlist?.setOnWatchlist(auctionId, false);
        setLocalOnWatchlist(false);
        toast.success(t("watchlistRemove"));
      } else {
        await auctionsService.addToWatchlist(auctionId);
        watchlist?.setOnWatchlist(auctionId, true);
        setLocalOnWatchlist(true);
        toast.success(t("watchlistAdd"));
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : t("watchlistError")
      );
    } finally {
      setLoading(false);
    }
  }

  const label = onWatchlist ? t("watchlistRemove") : t("watchlistAdd");

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={loading}
      onClick={toggleWatchlist}
      className={cn(
        "size-9 rounded-full border border-separator/60 bg-card/95 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-card",
        onWatchlist && "border-mazad-accent/40 bg-mazad-accent/10 text-mazad-accent hover:bg-mazad-accent/15",
        className
      )}
      aria-pressed={onWatchlist}
      aria-label={label}
      title={label}
    >
      <Heart
        className={cn("size-4", onWatchlist && "fill-current")}
        aria-hidden
      />
    </Button>
  );
}
