"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Subscription } from "@mazad/api";
import { formatMoney } from "@/lib/format";

type SubscriptionFeeBreakdownProps = {
  subscription: Pick<
    Subscription,
    "insurance_fee" | "subscription_fee" | "total_fee" | "participant_type"
  >;
};

export function SubscriptionFeeBreakdown({ subscription }: SubscriptionFeeBreakdownProps) {
  const locale = useLocale();
  const t = useTranslations("subscriptions");

  const insuranceLabel =
    subscription.participant_type === "seller"
      ? t("sellerInsurance")
      : t("bidderInsurance");

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">{insuranceLabel}</dt>
        <dd className="font-medium tabular-nums">
          {formatMoney(subscription.insurance_fee, locale)}
        </dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">{t("subscriptionFee")}</dt>
        <dd className="font-medium tabular-nums">
          {formatMoney(subscription.subscription_fee, locale)}
        </dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-border pt-2">
        <dt className="font-semibold">{t("totalDue")}</dt>
        <dd className="font-semibold tabular-nums text-mazad-accent">
          {formatMoney(subscription.total_fee, locale)}
        </dd>
      </div>
    </dl>
  );
}
