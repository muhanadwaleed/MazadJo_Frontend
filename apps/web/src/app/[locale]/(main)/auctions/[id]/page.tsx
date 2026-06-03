import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { auctionsService } from "@mazad/api";
import { formatDateTime, formatMoney } from "@/lib/format";
import { Container } from "@mazad/ui";
import { PageHeader } from "@mazad/ui";
import { AuctionStatusBadge } from "@/components/auctions/auction-status-badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@mazad/ui";
import { Separator } from "@mazad/ui";

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

  let auction;
  try {
    auction = await auctionsService.get(id);
  } catch {
    notFound();
  }

  return (
    <Container className="space-y-8">
      <PageHeader
        title={auction.title}
        description={`#${auction.auction_number}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <AuctionStatusBadge status={auction.status} />
            <ButtonLink variant="outline" href={routes.auctionBids(id)}>
              {t("bidHistory")}
            </ButtonLink>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("description")}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p className="whitespace-pre-wrap">
              {auction.description || t("noDescription")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("atAGlance")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("currentPrice")}</span>
              <span className="text-lg font-semibold">
                {formatMoney(auction.current_price, locale)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("minIncrement")}</span>
              <span>{formatMoney(auction.min_bid_increment, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("starts")}</span>
              <span>{formatDateTime(auction.starts_at, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("ends")}</span>
              <span>{formatDateTime(auction.ends_at, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("participants")}</span>
              <span>{auction.participants_count}</span>
            </div>
            <ButtonLink
              href={routes.auctionBids(id)}
              className="w-full bg-mazad-accent hover:bg-accent-dark"
            >
              {t("viewBidsAndPlace")}
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
