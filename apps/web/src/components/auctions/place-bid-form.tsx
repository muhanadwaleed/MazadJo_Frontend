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
      <Card>
        <CardHeader>
          <CardTitle>{t("closedTitle")}</CardTitle>
          <CardDescription>
            {t("closedDescription", { status })}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("signInRequiredTitle")}</CardTitle>
          <CardDescription>
            {t("minNextBid", { amount: formatMoney(minNext, locale) })}
          </CardDescription>
        </CardHeader>
        <CardFooter>
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
    <Card>
      <CardHeader>
        <CardTitle>{t("yourBidTitle")}</CardTitle>
        <CardDescription>
          {t("minDescription", { amount: formatMoney(minNext, locale) })}
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent>
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
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-mazad-accent hover:bg-accent-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("placing") : t("placeBid")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
