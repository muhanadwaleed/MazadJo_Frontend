"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError, disputesService, ratingsService } from "@mazad/api";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@mazad/ui";

type PostAuctionActionsProps = {
  auctionId: number;
};

/** Phase 7/8 — lightweight post-close rating and dispute entry points. */
export function PostAuctionActions({ auctionId }: PostAuctionActionsProps) {
  const t = useTranslations("postAuction");
  const [ratingScore, setRatingScore] = useState("5");
  const [disputeReason, setDisputeReason] = useState("");
  const [busy, setBusy] = useState<"rating" | "dispute" | null>(null);

  async function submitRating() {
    setBusy("rating");
    try {
      await ratingsService.createClient({
        auction: auctionId,
        score: Number.parseInt(ratingScore, 10),
      });
      toast.success(t("ratingSubmitted"));
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : t("ratingFailed"));
    } finally {
      setBusy(null);
    }
  }

  async function submitDispute() {
    if (!disputeReason.trim()) return;
    setBusy("dispute");
    try {
      await disputesService.createClient({
        auction: auctionId,
        reason: disputeReason.trim(),
      });
      toast.success(t("disputeSubmitted"));
      setDisputeReason("");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : t("disputeFailed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("rateTitle")}</CardTitle>
          <CardDescription>{t("rateDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`rating-${auctionId}`}>{t("ratingScore")}</Label>
            <Input
              id={`rating-${auctionId}`}
              type="number"
              min={1}
              max={5}
              value={ratingScore}
              onChange={(e) => setRatingScore(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            disabled={busy === "rating"}
            onClick={() => void submitRating()}
          >
            {busy === "rating" ? t("submitting") : t("submitRating")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("disputeTitle")}</CardTitle>
          <CardDescription>{t("disputeDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`dispute-${auctionId}`}>{t("disputeReason")}</Label>
            <Input
              id={`dispute-${auctionId}`}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder={t("disputeReasonPlaceholder")}
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={busy === "dispute" || !disputeReason.trim()}
            onClick={() => void submitDispute()}
          >
            {busy === "dispute" ? t("submitting") : t("openDispute")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
