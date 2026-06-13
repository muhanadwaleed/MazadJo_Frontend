"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError, auctionsService } from "@mazad/api";
import { useAuth } from "@mazad/auth";
import { Button } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

type AuctionWatchlistButtonProps = {
  auctionId: number;
  initialOnWatchlist: boolean;
  className?: string;
};

export function AuctionWatchlistButton({
  auctionId,
  initialOnWatchlist,
  className,
}: AuctionWatchlistButtonProps) {
  const t = useTranslations("auctionDetail");
  const { isAuthenticated } = useAuth();
  const [onWatchlist, setOnWatchlist] = useState(initialOnWatchlist);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setOnWatchlist(false);
      return;
    }

    let cancelled = false;
    auctionsService
      .getClient(auctionId)
      .then((auction) => {
        if (!cancelled) {
          setOnWatchlist(auction.is_on_watchlist);
        }
      })
      .catch(() => {
        /* keep server-provided initial state */
      });

    return () => {
      cancelled = true;
    };
  }, [auctionId, isAuthenticated]);

  async function toggleWatchlist() {
    if (!isAuthenticated) {
      toast.error(t("watchlistSignIn"));
      return;
    }

    setLoading(true);
    try {
      if (onWatchlist) {
        await auctionsService.removeFromWatchlist(auctionId);
        setOnWatchlist(false);
        toast.success(t("watchlistRemove"));
      } else {
        await auctionsService.addToWatchlist(auctionId);
        setOnWatchlist(true);
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

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={toggleWatchlist}
      className={cn(
        "cursor-pointer gap-2",
        onWatchlist && "border-mazad-accent/40 bg-mazad-accent/8 text-mazad-accent",
        className
      )}
      aria-pressed={onWatchlist}
    >
      <Heart
        className={cn("size-4", onWatchlist && "fill-current")}
        aria-hidden
      />
      <span className="hidden sm:inline">
        {onWatchlist ? t("watchlistRemove") : t("watchlistAdd")}
      </span>
    </Button>
  );
}
