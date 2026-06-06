"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import {
  ApiError,
  auctionsService,
  getApiErrorMessage,
  type AuctionListItem,
} from "@mazad/api";
import { AuctionStatusBadge } from "@/components/auctions/auction-status-badge";
import { routes } from "@/config/routes";
import { useRouter } from "@/i18n/navigation";
import { formatDateTime, formatMoney } from "@/lib/format";
import {
  canCancelListing,
  canEditListing,
  canSubmitListing,
} from "@/lib/seller-listing-actions";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@mazad/ui";

type SellerListingRowProps = {
  auction: AuctionListItem;
  onUpdated: () => void;
};

export function SellerListingRow({ auction, onUpdated }: SellerListingRowProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("dashboard.listings");
  const tCommon = useTranslations("common");
  const [busy, setBusy] = useState<"submit" | "cancel" | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  async function handleSubmit() {
    setBusy("submit");
    try {
      await auctionsService.submitClient(auction.id);
      toast.success(t("submitSuccess"));
      setSubmitOpen(false);
      onUpdated();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("submitFailed")
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleCancel() {
    setBusy("cancel");
    try {
      await auctionsService.cancelClient(auction.id, cancelReason.trim() || undefined);
      toast.success(t("cancelSuccess"));
      setCancelOpen(false);
      setCancelReason("");
      onUpdated();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("cancelFailed")
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="min-w-0 space-y-1">
            <CardTitle className="line-clamp-2 text-base">{auction.title}</CardTitle>
            <CardDescription>#{auction.auction_number}</CardDescription>
          </div>
          <AuctionStatusBadge status={auction.status} />
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-2 sm:block">
            <span className="text-muted-foreground">{t("startPrice")}</span>
            <span className="font-medium">{formatMoney(auction.start_price, locale)}</span>
          </div>
          <div className="flex justify-between gap-2 sm:block">
            <span className="text-muted-foreground">{t("ends")}</span>
            <span>{formatDateTime(auction.ends_at, locale)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <ButtonLink href={routes.auction(auction.id)} variant="default" size="sm">
            {tCommon("view")}
          </ButtonLink>
          {canEditListing(auction.status) ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(routes.listingEdit(auction.id))}
            >
              {tCommon("edit")}
            </Button>
          ) : null}
          {canSubmitListing(auction.status) ? (
            <Button size="sm" onClick={() => setSubmitOpen(true)}>
              {t("submit")}
            </Button>
          ) : null}
          {canCancelListing(auction.status) ? (
            <Button size="sm" variant="destructive" onClick={() => setCancelOpen(true)}>
              {t("cancel")}
            </Button>
          ) : null}
        </CardFooter>
      </Card>

      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("submitTitle")}</DialogTitle>
            <DialogDescription>{t("submitDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSubmitOpen(false)} disabled={busy === "submit"}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={() => void handleSubmit()} disabled={busy === "submit"}>
              {busy === "submit" ? t("submitting") : t("submitConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cancelTitle")}</DialogTitle>
            <DialogDescription>{t("cancelDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`cancel-reason-${auction.id}`}>{t("cancelReasonLabel")}</Label>
            <Input
              id={`cancel-reason-${auction.id}`}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={t("cancelReasonPlaceholder")}
              disabled={busy === "cancel"}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCancelOpen(false)} disabled={busy === "cancel"}>
              {tCommon("back")}
            </Button>
            <Button variant="destructive" onClick={() => void handleCancel()} disabled={busy === "cancel"}>
              {busy === "cancel" ? t("cancelling") : t("cancelConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
