import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Gavel, History } from "lucide-react";

import { routes } from "@/config/routes";
import { auctionsService } from "@mazad/api";
import { formatMoney } from "@/lib/format";
import { Container, ContentSection, PageHero } from "@mazad/ui";
import { BidList } from "@/components/auctions/bid-list";
import { PlaceBidForm } from "@/components/auctions/place-bid-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { ButtonLink } from "@/components/ui/button-link";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("bids");
  try {
    const auction = await auctionsService.get(id);
    return { title: `${t("title")} · ${auction.title}` };
  } catch {
    return { title: t("fallbackTitle") };
  }
}

export default async function AuctionBidsPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations("bids");

  let auction;
  let bids;
  try {
    [auction, bids] = await Promise.all([
      auctionsService.get(id),
      auctionsService.bids(id, { page_size: 50 }),
    ]);
  } catch {
    notFound();
  }

  const formattedPrice = formatMoney(auction.current_price, locale);

  return (
    <Container className="space-y-8 py-2 md:py-4">
      <PageBackLink href={routes.auction(id)}>{t("backToAuction")}</PageBackLink>

      <PageHero
        eyebrow={<Gavel className="size-3.5" />}
        title={t("title")}
        description={t("pageDescription", {
          title: auction.title,
          price: formattedPrice,
        })}
        actions={
          <>
            <ButtonLink size="lg" variant="heroPrimary" href={routes.auction(id)}>
              {t("auctionDetails")}
            </ButtonLink>
            <ButtonLink size="lg" variant="heroOutline" href={routes.auctions}>
              {t("allAuctions")}
            </ButtonLink>
          </>
        }
        aside={
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              {t("currentPriceLabel")}
            </p>
            <p className="mt-1 text-3xl font-bold">{formattedPrice}</p>
            <p className="mt-2 text-xs text-white/70">
              {t("bidCount", { count: bids.results.length })}
            </p>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <ContentSection
            title={t("recentBids")}
            description={t("recentBidsDescription")}
            icon={<History className="size-6 stroke-[1.75]" />}
          >
            <BidList bids={bids.results} />
          </ContentSection>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <PlaceBidForm
            auctionId={id}
            currentPrice={auction.current_price}
            minIncrement={auction.min_bid_increment}
            status={auction.status}
          />
        </aside>
      </div>
    </Container>
  );
}
