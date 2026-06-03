import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { auctionsService } from "@mazad/api";
import { formatMoney } from "@/lib/format";
import { Container } from "@mazad/ui";
import { PageHeader } from "@mazad/ui";
import { BidList } from "@/components/auctions/bid-list";
import { PlaceBidForm } from "@/components/auctions/place-bid-form";
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

  return (
    <Container className="space-y-8">
      <PageHeader
        title={t("title")}
        description={t("pageDescription", {
          title: auction.title,
          price: formatMoney(auction.current_price, locale),
        })}
        actions={
          <ButtonLink variant="outline" href={routes.auction(id)}>
            {t("auctionDetails")}
          </ButtonLink>
        }
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("recentBids")}</h2>
          <BidList bids={bids.results} />
        </section>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("placeBidSection")}</h2>
          <PlaceBidForm
            auctionId={id}
            currentPrice={auction.current_price}
            minIncrement={auction.min_bid_increment}
            status={auction.status}
          />
        </section>
      </div>
    </Container>
  );
}
