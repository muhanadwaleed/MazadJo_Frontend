"use client";

/**
 * AuctionDetailClient
 * - Sellers cannot bid on their own live auctions.
 * - Bidders must pay (active subscription) before the bid form is shown.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Ban } from "lucide-react";
import { toast } from "sonner";

import {
  ApiError,
  auctionsService,
  findBidderSubscription,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mazad/ui";

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

type LiveSidebarMode =
  | "loading"
  | "guest"
  | "seller"
  | "payment"
  | "bid"
  | "inactive";

function isSubscriptionRequiredError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  return (
    error.code === "subscription_required" ||
    /subscribe|subscription/i.test(error.message)
  );
}

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
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const tBidForm = useTranslations("bidForm");
  const tDetail = useTranslations("auctionDetail");
  const tSubs = useTranslations("subscriptions");

  const paymentRef = useRef<HTMLDivElement>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [lastFetchedAuctionId, setLastFetchedAuctionId] = useState<number | null>(
    null
  );
  const [forcePayment, setForcePayment] = useState(false);

  const isLiveAuction =
    backendStatus === "active" || auction.status === "active";

  const isSeller = useMemo(() => {
    if (!user) return false;
    return Number(user.id) === Number(sellerId);
  }, [sellerId, user]);

  const shouldCheckSubscription =
    !authLoading && isAuthenticated && isLiveAuction && !isSeller;

  const subscriptionMatchesAuction = lastFetchedAuctionId === auctionId;
  const effectiveSubscription = shouldCheckSubscription && subscriptionMatchesAuction
    ? subscription
    : null;
  const hasActiveSubscription = effectiveSubscription?.status === "active";
  const effectiveSubscriptionChecked =
    !shouldCheckSubscription ||
    (subscriptionChecked && subscriptionMatchesAuction);
  const effectiveSubscriptionLoading =
    shouldCheckSubscription &&
    (!effectiveSubscriptionChecked || subscriptionLoading);
  const effectiveForcePayment = forcePayment && !hasActiveSubscription;

  const liveSidebarMode: LiveSidebarMode = useMemo(() => {
    if (!isLiveAuction) return "inactive";
    if (authLoading) return "loading";
    if (!isAuthenticated) return "guest";
    if (isSeller) return "seller";
    if (effectiveSubscriptionLoading || !effectiveSubscriptionChecked) {
      return "loading";
    }
    if (!hasActiveSubscription || effectiveForcePayment) return "payment";
    return "bid";
  }, [
    authLoading,
    effectiveForcePayment,
    effectiveSubscriptionChecked,
    effectiveSubscriptionLoading,
    hasActiveSubscription,
    isAuthenticated,
    isLiveAuction,
    isSeller,
  ]);

  const refreshSubscription = useCallback(
    async (signal?: { cancelled: boolean }) => {
      if (!isAuthenticated || !user || isSeller || !isLiveAuction) {
        return null;
      }

      setSubscriptionLoading(true);
      try {
        const data = await subscriptionsService.listClient({ auction: auctionId });
        if (signal?.cancelled) return null;
        const existing = findBidderSubscription(data.results, user.id);
        setSubscription(existing);
        setLastFetchedAuctionId(auctionId);
        return existing;
      } catch {
        if (signal?.cancelled) return null;
        setSubscription(null);
        setLastFetchedAuctionId(auctionId);
        return null;
      } finally {
        if (signal?.cancelled) return;
        setSubscriptionLoading(false);
        setSubscriptionChecked(true);
      }
    },
    [auctionId, isAuthenticated, isLiveAuction, isSeller, user]
  );

  useEffect(() => {
    if (!shouldCheckSubscription || !user) return;

    const signal = { cancelled: false };
    void refreshSubscription(signal);

    return () => {
      signal.cancelled = true;
    };
  }, [shouldCheckSubscription, refreshSubscription, user]);

  function scrollToPayment() {
    setForcePayment(true);
    requestAnimationFrame(() => {
      paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function handleBid(amount: number) {
    if (!isAuthenticated) {
      const message = tBidForm("signInToBid");
      toast.error(message);
      throw new Error(message);
    }

    if (isSeller && isLiveAuction) {
      const message = tBidForm("sellerCannotBid");
      toast.error(message);
      throw new Error(message);
    }

    if (isLiveAuction && !hasActiveSubscription) {
      scrollToPayment();
      throw new Error(tSubs("subscriptionRequired"));
    }

    try {
      await auctionsService.placeBid(auctionId, {
        amount: String(amount),
        bid_source: "manual",
      });
      toast.success(tBidForm("bidPlaced"));
      router.refresh();
    } catch (error) {
      if (isSubscriptionRequiredError(error)) {
        await refreshSubscription();
        scrollToPayment();
        throw new Error(tSubs("subscriptionRequired"));
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

  async function handlePaymentActivated() {
    setForcePayment(false);
    await refreshSubscription();
    router.refresh();
  }

  const showBidPanel =
    !isLiveAuction ||
    liveSidebarMode === "guest" ||
    liveSidebarMode === "bid";

  const sidebarGate = (() => {
    if (liveSidebarMode === "loading") {
      return (
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {tSubs("loading")}
        </div>
      );
    }

    if (liveSidebarMode === "seller") {
      return (
        <Card className="border-dashed">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted">
              <Ban className="size-5 text-muted-foreground" aria-hidden />
            </div>
            <CardTitle className="text-lg">{tDetail("ownListingTitle")}</CardTitle>
            <CardDescription>{tDetail("ownListingNoBid")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{tDetail("ownListingHint")}</p>
          </CardContent>
        </Card>
      );
    }

    if (liveSidebarMode === "payment") {
      return (
        <div ref={paymentRef}>
          <SubscriptionCheckoutPanel
            auctionId={auctionId}
            auctionTitle={auction.title}
            intent="bidder_join"
            onActivated={() => void handlePaymentActivated()}
          />
        </div>
      );
    }

    return null;
  })();

  return (
    <>
      <AuctionDetailPage
        auction={auction}
        currency={currency}
        isRtl={isRtl}
        isWatchlisted={isWatchlisted}
        onBid={showBidPanel ? handleBid : undefined}
        onWatchlist={handleWatchlist}
        subscriptionGate={sidebarGate}
        hideBidPanel={isLiveAuction && !showBidPanel}
        winnerBidId={winnerBidId}
        backendStatus={backendStatus}
      />
      {isAuthenticated &&
      (backendStatus === "ended" ||
        backendStatus === "closed" ||
        backendStatus === "delivery_in_progress") ? (
        <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
          <PostAuctionActions auctionId={auctionId} />
        </div>
      ) : null}
    </>
  );
}
