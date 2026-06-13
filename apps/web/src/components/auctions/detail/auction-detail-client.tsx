"use client";

/**
 * AuctionDetailClient
 * Client bridge that supplies bid + watchlist handlers and Phase 5 subscription
 * gating (subscribe-to-bid) before placeBid is allowed.
 */

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  ApiError,
  auctionsService,
  subscriptionsService,
  type AuctionStatus,
  type Subscription,
} from "@mazad/api";
import { useAuth } from "@mazad/auth";

import { PostAuctionActions } from "@/components/auctions/post-auction-actions";
import { SubscriptionCheckoutPanel } from "@/components/subscriptions/subscription-checkout-panel";
import { useRouter } from "@/i18n/navigation";
import {
  AuctionDetailPage,
  type AuctionDetailData,
} from "./AuctionDetailPage";

type AuctionDetailClientProps = {
  auction: AuctionDetailData;
  auctionId: number;
  backendStatus: AuctionStatus;
  sellerId: number;
  winnerBidId?: number | null;
  currency?: string;
  isRtl?: boolean;
  isWatchlisted?: boolean;
};

export function AuctionDetailClient({
  auction,
  auctionId,
  backendStatus,
  sellerId,
  winnerBidId,
  currency,
  isRtl,
  isWatchlisted,
}: AuctionDetailClientProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const tBidForm = useTranslations("bidForm");
  const tDetail = useTranslations("auctionDetail");
  const tSubs = useTranslations("subscriptions");

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const isSeller = user?.id === sellerId;
  const needsBidderSubscription =
    backendStatus === "active" && isAuthenticated && !isSeller;
  const hasActiveSubscription = subscription?.status === "active";

  useEffect(() => {
    if (!needsBidderSubscription) {
      setSubscription(null);
      return;
    }

    let cancelled = false;
    setSubscriptionLoading(true);
    void subscriptionsService
      .listClient({ auction: auctionId })
      .then((data) => {
        if (!cancelled) setSubscription(data.results?.[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setSubscription(null);
      })
      .finally(() => {
        if (!cancelled) setSubscriptionLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [auctionId, needsBidderSubscription]);

  async function handleBid(amount: number) {
    if (!isAuthenticated) {
      const message = tBidForm("signInToBid");
      toast.error(message);
      throw new Error(message);
    }

    if (needsBidderSubscription && !hasActiveSubscription) {
      const message = tSubs("subscriptionRequired");
      toast.error(message);
      throw new Error(message);
    }

    try {
      await auctionsService.placeBid(auctionId, {
        amount: String(amount),
        bid_source: "manual",
      });
      toast.success(tBidForm("bidPlaced"));
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.code === "subscription_required") {
        const message = tSubs("subscriptionRequired");
        toast.error(message);
        throw new Error(message);
      }
      const message =
        error instanceof ApiError ? error.message : tBidForm("bidFailed");
      toast.error(message);
      throw new Error(message);
    }
  }

  async function handleWatchlist(watched: boolean) {
    if (!isAuthenticated) {
      toast.error(tDetail("watchlistSignIn"));
      return;
    }

    try {
      if (watched) {
        await auctionsService.addToWatchlist(auctionId);
        toast.success(tDetail("watchlistAdd"));
      } else {
        await auctionsService.removeFromWatchlist(auctionId);
        toast.success(tDetail("watchlistRemove"));
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : tDetail("watchlistError")
      );
    }
  }

  const subscribePanel =
    needsBidderSubscription && !hasActiveSubscription && !subscriptionLoading ? (
      <SubscriptionCheckoutPanel
        auctionId={auctionId}
        auctionTitle={auction.title}
        intent="bidder_join"
        onActivated={() => {
          router.refresh();
        }}
      />
    ) : null;

  const postAuctionPanel =
    isAuthenticated &&
    (backendStatus === "ended" ||
      backendStatus === "closed" ||
      backendStatus === "delivery_in_progress") ? (
      <PostAuctionActions auctionId={auctionId} />
    ) : null;

  return (
    <>
      <AuctionDetailPage
        auction={auction}
        currency={currency}
        isRtl={isRtl}
        isWatchlisted={isWatchlisted}
        onBid={needsBidderSubscription && !hasActiveSubscription ? undefined : handleBid}
        onWatchlist={handleWatchlist}
        subscriptionGate={subscribePanel}
        winnerBidId={winnerBidId}
        backendStatus={backendStatus}
      />
      {postAuctionPanel ? (
        <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">{postAuctionPanel}</div>
      ) : null}
    </>
  );
}
