"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  ApiError,
  getApiErrorMessage,
  subscriptionsService,
  type Subscription,
} from "@mazad/api";
import { useSubscriptionPoll } from "@/hooks/use-subscription-poll";
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
  const [creating, setCreating] = useState(false);
  const [localSubscription, setLocalSubscription] = useState<Subscription | null>(null);

  const pollEnabled = Boolean(localSubscription);
  const { subscription, loading, isActive, isPending, refresh } = useSubscriptionPoll({
    auctionId,
    enabled: pollEnabled,
    onActive: () => {
      toast.success(
        intent === "seller_activate" ? t("activateSuccess") : t("joinSuccess")
      );
      onActivated?.();
    },
  });

  const activeSubscription = subscription ?? localSubscription;
  const showPending = isPending || (activeSubscription && !isActive);

  async function handleStartCheckout() {
    setCreating(true);
    try {
      const created = await subscriptionsService.createClient({ auction: auctionId });
      setLocalSubscription(created);
      toast.success(t("checkoutStarted"));
    } catch (error) {
      if (error instanceof ApiError && error.code === "subscription_exists") {
        await refresh();
      } else {
        toast.error(
          error instanceof ApiError ? getApiErrorMessage(error) : t("checkoutFailed")
        );
      }
    } finally {
      setCreating(false);
    }
  }

  const title =
    intent === "seller_activate" ? t("sellerActivateTitle") : t("bidderJoinTitle");
  const description =
    intent === "seller_activate"
      ? t("sellerActivateDescription", { title: auctionTitle })
      : t("bidderJoinDescription", { title: auctionTitle });

  const content = (
    <div className="space-y-4">
      {!activeSubscription ? (
        <Button
          className="w-full"
          size={compact ? "sm" : "default"}
          disabled={creating || loading}
          onClick={() => void handleStartCheckout()}
        >
          {creating ? (
            <>
              <Loader2 className="me-2 size-4 animate-spin" />
              {t("startingCheckout")}
            </>
          ) : intent === "seller_activate" ? (
            t("payToActivate")
          ) : (
            t("payToJoin")
          )}
        </Button>
      ) : null}

      {activeSubscription ? (
        <>
          <SubscriptionFeeBreakdown subscription={activeSubscription} />
          {showPending ? (
            <div className="rounded-lg border border-dashed border-mazad-accent/40 bg-mazad-accent/5 p-3 text-sm">
              <p className="font-medium text-mazad-navy">{t("pendingPaymentTitle")}</p>
              <p className="mt-1 text-muted-foreground">{t("pendingPaymentHint")}</p>
              {activeSubscription.payment_transaction?.provider_reference ? (
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {t("reference")}: {activeSubscription.payment_transaction.provider_reference}
                </p>
              ) : null}
            </div>
          ) : null}
          {isActive ? (
            <p className="text-sm font-medium text-emerald-700">{t("paymentConfirmed")}</p>
          ) : null}
        </>
      ) : null}
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
