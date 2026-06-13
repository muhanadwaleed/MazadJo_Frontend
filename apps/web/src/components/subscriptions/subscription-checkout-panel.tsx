"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  ApiError,
  findBidderSubscription,
  findSellerSubscription,
  getApiErrorMessage,
  subscriptionsService,
  type Subscription,
} from "@mazad/api";
import { useAuth } from "@mazad/auth";
import { confirmSubscriptionPayment, getPaymentMode } from "@/lib/subscription-payment";
import { SubscriptionFeeBreakdown } from "@/components/subscriptions/subscription-fee-breakdown";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mazad/ui";

type SubscriptionCheckoutPanelProps = {
  auctionId: number;
  auctionTitle: string;
  /** Seller activation after approve, or bidder join on active auction. */
  intent: "seller_activate" | "bidder_join";
  onActivated?: () => void;
  compact?: boolean;
};

export function SubscriptionCheckoutPanel({
  auctionId,
  auctionTitle,
  intent,
  onActivated,
  compact = false,
}: SubscriptionCheckoutPanelProps) {
  const t = useTranslations("subscriptions");
  const { user } = useAuth();
  const paymentMode = getPaymentMode();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [paying, setPaying] = useState(false);

  const pickSubscription = useCallback(
    (results: Subscription[] | undefined) => {
      if (!user) return null;
      return intent === "seller_activate"
        ? findSellerSubscription(results, user.id)
        : findBidderSubscription(results, user.id);
    },
    [intent, user]
  );

  const loadExisting = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      return null;
    }
    try {
      const data = await subscriptionsService.listClient({ auction: auctionId });
      const existing = pickSubscription(data.results);
      setSubscription(existing);
      if (existing?.status === "active") {
        onActivated?.();
      }
      return existing;
    } catch {
      setSubscription(null);
      return null;
    }
  }, [auctionId, onActivated, pickSubscription, user]);

  useEffect(() => {
    void loadExisting().finally(() => setLoadingExisting(false));
  }, [loadExisting]);

  const isActive = subscription?.status === "active";
  const isPending = subscription?.status === "pending_payment";

  async function handlePayNow() {
    setPaying(true);
    try {
      let current = subscription;

      if (!current) {
        current = await subscriptionsService.createClient({ auction: auctionId });
        setSubscription(current);
      }

      if (current.status === "active") {
        toast.success(
          intent === "seller_activate" ? t("activateSuccess") : t("joinSuccess")
        );
        onActivated?.();
        return;
      }

      const confirmed = await confirmSubscriptionPayment(current);
      setSubscription(confirmed);

      if (confirmed.status === "active") {
        toast.success(
          intent === "seller_activate" ? t("activateSuccess") : t("joinSuccess")
        );
        onActivated?.();
      }
    } catch (error) {
      if (error instanceof Error && error.message === "gateway_not_configured") {
        toast.error(t("gatewayNotReady"));
        return;
      }
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("paymentFailed")
      );
    } finally {
      setPaying(false);
    }
  }

  const title =
    intent === "seller_activate" ? t("sellerActivateTitle") : t("bidderJoinTitle");
  const description =
    intent === "seller_activate"
      ? t("sellerActivateDescription", { title: auctionTitle })
      : t("bidderJoinDescription", { title: auctionTitle });

  const payLabel =
    intent === "seller_activate" ? t("payToActivate") : t("payToJoin");

  const content = (
    <div className="space-y-4">
      {subscription && !isActive ? (
        <SubscriptionFeeBreakdown subscription={subscription} />
      ) : null}

      {isActive ? (
        <p className="text-sm font-medium text-emerald-700">{t("paymentConfirmed")}</p>
      ) : (
        <>
          <Button
            className="w-full"
            size={compact ? "sm" : "default"}
            disabled={paying || loadingExisting}
            onClick={() => void handlePayNow()}
          >
            {paying || loadingExisting ? (
              <>
                <Loader2 className="me-2 size-4 animate-spin" />
                {paying ? t("processingPayment") : t("loading")}
              </>
            ) : (
              <>
                <CreditCard className="me-2 size-4" aria-hidden />
                {payLabel}
              </>
            )}
          </Button>

          {paymentMode === "simulate" ? (
            <p className="text-center text-xs text-muted-foreground">{t("simulateNote")}</p>
          ) : null}

          {isPending && subscription?.payment_transaction?.provider_reference ? (
            <p className="font-mono text-xs text-muted-foreground">
              {t("reference")}: {subscription.payment_transaction.provider_reference}
            </p>
          ) : null}
        </>
      )}
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {intent === "bidder_join" ? (
            <>
              <span className="block font-medium text-mazad-navy">{t("payToBidHint")}</span>
              <span className="mt-1 block">{description}</span>
            </>
          ) : (
            description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
