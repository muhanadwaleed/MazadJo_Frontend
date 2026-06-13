"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import { ApiError } from "@mazad/api";
import { auctionsService } from "@mazad/api";
import { formatMoney } from "@/lib/format";
import { useAuth } from "@mazad/auth";
import { Button } from "@mazad/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@mazad/ui";
import { Label } from "@mazad/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@mazad/ui";

export function PlaceBidForm({
  auctionId,
  currentPrice,
  minIncrement,
  status,
  embedded = false,
}: {
  auctionId: string;
  currentPrice: string;
  minIncrement: string;
  status: string;
  embedded?: boolean;
}) {
  const t = useTranslations("bidForm");
  const locale = useLocale();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minNext =
    Number.parseFloat(currentPrice) + Number.parseFloat(minIncrement);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error(t("signInToBid"));
      return;
    }
    const amount = String(new FormData(event.currentTarget).get("amount"));
    setIsSubmitting(true);
    try {
      await auctionsService.placeBid(auctionId, {
        amount,
        bid_source: "manual",
      });
      toast.success(t("bidPlaced"));
      window.location.reload();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error(t("bidFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const loginHref = `${routes.login}?next=${encodeURIComponent(routes.auction(auctionId))}`;

  if (status !== "active") {
    if (embedded) return null;
    return (
      <Card className="overflow-hidden border-separator/60 shadow-md">
        <CardHeader className="border-b border-separator/60 bg-gradient-to-br from-surface to-card">
          <CardTitle className="text-navy">{t("closedTitle")}</CardTitle>
          <CardDescription>{t("closedDescription", { status })}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isAuthenticated) {
    if (embedded) {
      return (
        <div className="space-y-3 rounded-xl border border-mazad-primary/20 bg-mazad-primary/5 p-4">
          <p className="text-sm font-semibold text-navy">{t("signInRequiredTitle")}</p>
          <p className="text-sm text-muted-foreground">
            {t("minNextBid", { amount: formatMoney(minNext, locale) })}
          </p>
          <ButtonLink className="w-full" href={loginHref}>
            {t("signInToBidButton")}
          </ButtonLink>
        </div>
      );
    }
    return (
      <Card className="overflow-hidden border-separator/60 shadow-md">
        <CardHeader className="border-b border-separator/60 bg-gradient-to-br from-mazad-primary/8 via-surface to-light-blue/10">
          <CardTitle className="text-navy">{t("signInRequiredTitle")}</CardTitle>
          <CardDescription>
            {t("minNextBid", { amount: formatMoney(minNext, locale) })}
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-5">
          <ButtonLink className="w-full" href={loginHref}>
            {t("signInToBidButton")}
          </ButtonLink>
        </CardFooter>
      </Card>
    );
  }

  if (embedded) {
    return (
      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-separator/60 bg-card p-4 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-navy">{t("yourBidTitle")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("minDescription", { amount: formatMoney(minNext, locale) })}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`amount-${auctionId}`}>{t("amountLabel")}</Label>
          <Input
            id={`amount-${auctionId}`}
            name="amount"
            type="number"
            step="0.01"
            min={minNext}
            required
            defaultValue={minNext.toFixed(2)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("placing") : t("placeBid")}
        </Button>
      </form>
    );
  }

  return (
    <Card className="overflow-hidden border-separator/60 shadow-md">
      <CardHeader className="border-b border-separator/60 bg-gradient-to-br from-mazad-primary/8 via-surface to-light-blue/10">
        <CardTitle className="text-navy">{t("yourBidTitle")}</CardTitle>
        <CardDescription>
          {t("minDescription", { amount: formatMoney(minNext, locale) })}
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="p-5">
          <div className="space-y-2">
            <Label htmlFor="amount">{t("amountLabel")}</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min={minNext}
              required
              defaultValue={minNext.toFixed(2)}
            />
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("placing") : t("placeBid")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
