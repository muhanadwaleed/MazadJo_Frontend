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
}: {
  auctionId: string;
  currentPrice: string;
  minIncrement: string;
  status: string;
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

  if (status !== "active") {
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
    return (
      <Card className="overflow-hidden border-separator/60 shadow-md">
        <CardHeader className="border-b border-separator/60 bg-gradient-to-br from-mazad-primary/8 via-surface to-light-blue/10">
          <CardTitle className="text-navy">{t("signInRequiredTitle")}</CardTitle>
          <CardDescription>
            {t("minNextBid", { amount: formatMoney(minNext, locale) })}
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-5">
          <ButtonLink
            className="w-full"
            href={`${routes.login}?next=${encodeURIComponent(routes.auctionBids(auctionId))}`}
          >
            {t("signInToBidButton")}
          </ButtonLink>
        </CardFooter>
      </Card>
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
