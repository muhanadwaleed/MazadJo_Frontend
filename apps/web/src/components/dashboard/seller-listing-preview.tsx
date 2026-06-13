"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CreditCard, Eye, FilePenLine, Gavel } from "lucide-react";

import { auctionsService, type AuctionDetail } from "@mazad/api";
import { AuctionMediaGallery } from "@/components/auctions/auction-media-gallery";
import { AuctionStatusBadge } from "@/components/auctions/auction-status-badge";
import { ErrorState } from "@/components/common/error-state";
import { SubscriptionCheckoutPanel } from "@/components/subscriptions/subscription-checkout-panel";
import { PageBackLink } from "@/components/layout/page-back-link";
import { ButtonLink } from "@/components/ui/button-link";
import { routes } from "@/config/routes";
import { useRouter } from "@/i18n/navigation";
import { formatDateTime, formatMoney } from "@/lib/format";
import {
  canActivateListing,
  canEditListing,
  isPubliclyViewableListing,
  needsSellerPayment,
} from "@/lib/seller-listing-actions";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@mazad/ui";

type SellerListingPreviewProps = {
  auctionId: number;
};

function statusHintKey(status: string): string | null {
  switch (status) {
    case "draft":
      return "statusDraft";
    case "under_review":
      return "statusUnderReview";
    case "returned_for_edit":
      return "statusReturned";
    case "approved":
      return "statusApproved";
    case "rejected":
      return "statusRejected";
    case "cancelled":
      return "statusCancelled";
    default:
      return null;
  }
}

export function SellerListingPreview({ auctionId }: SellerListingPreviewProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("dashboard.listingPreview");
  const tListings = useTranslations("dashboard.listings");
  const tGallery = useTranslations("auctionDetail");

  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    auctionsService
      .getClient(auctionId)
      .then((data) => {
        if (!cancelled) setAuction(data);
      })
      .catch(() => {
        if (!cancelled) setError(t("loadError"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [auctionId, t]);

  function handleActivated() {
    router.push(routes.auction(auctionId));
    router.refresh();
  }

  if (loading) {
    return (
      <Container className="py-8">
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </Container>
    );
  }

  if (error || !auction) {
    return (
      <Container className="space-y-4 py-8">
        <PageBackLink href={routes.dashboard}>{t("backToDashboard")}</PageBackLink>
        <ErrorState message={error ?? t("loadError")} />
      </Container>
    );
  }

  const hintKey = statusHintKey(auction.status);
  const showPayPanel = needsSellerPayment(auction.status);
  const showLiveLink = isPubliclyViewableListing(auction.status);

  return (
    <Container className="space-y-8 py-2 md:py-4">
      <PageBackLink href={routes.dashboard}>{t("backToDashboard")}</PageBackLink>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5 border-mazad-primary/25 text-mazad-primary">
              <Eye className="size-3.5" aria-hidden />
              {t("eyebrow")}
            </Badge>
            <AuctionStatusBadge status={auction.status} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            {auction.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            #{auction.auction_number}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canEditListing(auction.status) ? (
            <ButtonLink href={routes.listingEdit(auction.id)} variant="outline" size="sm">
              <FilePenLine className="size-4" aria-hidden />
              {t("editListing")}
            </ButtonLink>
          ) : null}
          {showLiveLink ? (
            <ButtonLink href={routes.auction(auction.id)} size="sm">
              <Gavel className="size-4" aria-hidden />
              {t("viewLive")}
            </ButtonLink>
          ) : null}
        </div>
      </div>

      {showPayPanel ? (
        <Card
          id="pay"
          className="scroll-mt-24 overflow-hidden border-mazad-accent/25 bg-gradient-to-br from-mazad-accent/[0.08] via-card to-card shadow-md"
        >
          <CardHeader className="border-b border-mazad-accent/10 bg-mazad-accent/[0.04] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-mazad-accent/15 text-mazad-accent">
                <CreditCard className="size-5" aria-hidden />
              </div>
              <div>
                <CardTitle className="text-lg text-navy">{t("payCardTitle")}</CardTitle>
                <CardDescription>{t("payCardDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <SubscriptionCheckoutPanel
              auctionId={auction.id}
              auctionTitle={auction.title}
              intent="seller_activate"
              onActivated={handleActivated}
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-6">
          <AuctionMediaGallery
            auctionId={auction.id}
            mediaItems={auction.media_items}
            title={auction.title}
            authenticated
            noPhotosLabel={tGallery("noPhotos")}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("descriptionTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {auction.description || t("noDescription")}
              </p>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          {hintKey ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-sm text-muted-foreground">
                {t(hintKey)}
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detailsTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">{tListings("startPrice")}</span>
                <span className="font-semibold text-navy">
                  {formatMoney(auction.start_price, locale)}
                </span>
              </div>
              {auction.reserve_price ? (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{t("reservePrice")}</span>
                  <span className="font-medium">
                    {formatMoney(auction.reserve_price, locale)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">{t("minIncrement")}</span>
                <span className="font-medium">
                  {formatMoney(auction.min_bid_increment, locale)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {auction.ends_at ? tListings("ends") : tListings("duration")}
                </span>
                <span className="font-medium">
                  {auction.ends_at
                    ? formatDateTime(auction.ends_at, locale)
                    : auction.duration_days
                      ? tListings("durationDaysValue", { days: auction.duration_days })
                      : "—"}
                </span>
              </div>
            </CardContent>
          </Card>

          {canActivateListing(auction.status) && !showPayPanel ? (
            <ButtonLink href={`${routes.listingView(auction.id)}#pay`} className="w-full">
              <CreditCard className="size-4" aria-hidden />
              {tListings("activate")}
            </ButtonLink>
          ) : null}
        </aside>
      </div>
    </Container>
  );
}
