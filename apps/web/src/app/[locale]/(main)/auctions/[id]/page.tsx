import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { auctionsService } from "@mazad/api";
import { formatDateTime, formatMoney } from "@/lib/format";
import { Container, ContentSection, LiveAuctionIndicator } from "@mazad/ui";
import { AuctionDetailSummary } from "@/components/auctions/auction-detail-summary";
import { AuctionMediaGallery } from "@/components/auctions/auction-media-gallery";
import { AuctionStatusBadge } from "@/components/auctions/auction-status-badge";
import { PageBackLink } from "@/components/layout/page-back-link";
import { ButtonLink } from "@/components/ui/button-link";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("auctionDetail");
  try {
    const auction = await auctionsService.get(id);
    return { title: auction.title };
  } catch {
    return { title: t("fallbackTitle") };
  }
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations("auctionDetail");
  const tAuctions = await getTranslations("auctions");

  let auction;
  try {
    auction = await auctionsService.get(id);
  } catch {
    notFound();
  }

  const isLive = auction.status === "active";

  return (
    <Container className="space-y-8 py-2 md:py-4">
      <PageBackLink href={routes.auctions}>{t("backToAuctions")}</PageBackLink>

      <header className="space-y-4 border-b border-separator pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <AuctionStatusBadge status={auction.status} />
          {isLive ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-mazad-accent/25 bg-mazad-accent/8 px-3 py-1">
              <LiveAuctionIndicator />
            </span>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl md:text-4xl md:leading-tight">
          {auction.title}
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="space-y-6 lg:col-span-7">
          <AuctionMediaGallery
            auctionId={auction.id}
            mediaItems={auction.media_items}
            title={auction.title}
            noPhotosLabel={t("noPhotos")}
          />

          <ContentSection title={t("description")}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
              {auction.description || t("noDescription")}
            </p>
          </ContentSection>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-28">
          <AuctionDetailSummary
            auction={auction}
            formatted={{
              currentPrice: formatMoney(auction.current_price, locale),
              startingPrice: formatMoney(auction.start_price, locale),
              minIncrement: formatMoney(auction.min_bid_increment, locale),
              startsAt: formatDateTime(auction.starts_at, locale),
              endsAt: formatDateTime(auction.ends_at, locale),
            }}
            labels={{
              currentPrice: t("currentPrice"),
              startingPrice: tAuctions("startingPrice"),
              minIncrement: t("minIncrement"),
              starts: t("starts"),
              ends: t("ends"),
              participants: t("participants"),
              views: t("views"),
              countdown: {
                days: tAuctions("countdown.days"),
                hours: tAuctions("countdown.hours"),
                minutes: tAuctions("countdown.minutes"),
                seconds: tAuctions("countdown.seconds"),
              },
            }}
            actions={
              <>
                <ButtonLink href={routes.auctionBids(id)} className="w-full">
                  {t("viewBidsAndPlace")}
                </ButtonLink>
                <ButtonLink variant="outline" href={routes.auctionBids(id)} className="w-full">
                  {t("bidHistory")}
                </ButtonLink>
              </>
            }
          />
        </aside>
      </div>
    </Container>
  );
}
