"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  ApiError,
  asList,
  getApiErrorMessage,
  subscriptionsService,
  type Subscription,
} from "@mazad/api";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@mazad/ui";

function formatMoney(amount: string, locale: string) {
  const value = Number.parseFloat(amount);
  return new Intl.NumberFormat(locale === "ar" ? "ar-JO" : "en-JO", {
    style: "currency",
    currency: "JOD",
  }).format(Number.isNaN(value) ? 0 : value);
}

export function StaffSubscriptionsStagingPanel() {
  const locale = useLocale();
  const t = useTranslations("auctions.subscriptions.staging");
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionsService.listClient({
        status: "pending_payment",
        page_size: 50,
      });
      setItems(asList(data));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function markPaid(id: number) {
    setBusyId(id);
    try {
      await subscriptionsService.markPaidClient(id);
      toast.success(t("toast.markedPaid", { id }));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.markPaidFailed")
      );
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t("loading")}</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-base">
                {t("auctionLabel", { id: item.auction })}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("subscriptionId", { id: item.id })}
              </p>
            </div>
            <Badge variant="outline">{item.participant_type}</Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm">
              <p>
                <span className="text-muted-foreground">{t("total")}: </span>
                <span className="font-semibold tabular-nums">
                  {formatMoney(item.total_fee, locale)}
                </span>
              </p>
              {item.payment_transaction?.provider_reference ? (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {item.payment_transaction.provider_reference}
                </p>
              ) : null}
            </div>
            <Button
              size="sm"
              disabled={busyId === item.id}
              onClick={() => void markPaid(item.id)}
            >
              {busyId === item.id ? t("markingPaid") : t("markPaid")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
