import { getTranslations } from "next-intl/server";
import { Gavel } from "lucide-react";

import { routes } from "@/config/routes";
import { auctionsService } from "@mazad/api";
import { Container, EmptyState, FilterBar } from "@mazad/ui";
import { AnimatedAuctionGrid } from "@/components/auctions/animated-auction-grid";
import {
  AuctionSortFilters,
  sortAuctions,
  type AuctionSortValue,
} from "@/components/auctions/auction-sort-filters";
import { AuctionSearch } from "@/components/auctions/auction-search";
import { AuctionStatusFilters } from "@/components/auctions/auction-status-filters";
import { AuctionsLiveStrip } from "@/components/auctions/auctions-live-strip";
import { ErrorState } from "@/components/common/error-state";
import { MarketingSection } from "@/components/common/marketing-section";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { AddAuctionButton } from "@/components/auctions/add-auction-button";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";

type SearchParams = Promise<{ status?: string; search?: string; sort?: string }>;

function parseSort(value?: string): AuctionSortValue {
  if (
    value === "ending_soon" ||
    value === "price_low" ||
    value === "price_high" ||
    value === "newest"
  ) {
    return value;
  }
  return "newest";
}

export async function generateMetadata() {
  const t = await getTranslations("auctions");
  return { title: t("title") };
}

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations("auctions");
  const tCommon = await getTranslations("common");
  const tErrors = await getTranslations("errors");
  const params = await searchParams;
  const sort = parseSort(params.sort);

  try {
    const [data, liveData] = await Promise.all([
      auctionsService.list({
        status: params.status,
        search: params.search,
        page_size: 24,
      }),
      params.status && params.status !== "active"
        ? auctionsService.list({ status: "active", page_size: 8 })
        : Promise.resolve(null),
    ]);

    const sortedResults = sortAuctions(data.results, sort);
    const showLiveStrip = liveData && liveData.results.length > 0;

    const activeHref = params.search
      ? `/auctions?status=active&search=${encodeURIComponent(params.search)}`
      : "/auctions?status=active";

    return (
      <Container className="space-y-8 py-2 md:py-4">
        <ScrollReveal variant="fadeInDown">
          <PageHero
            eyebrow={
              <>
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mazad-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-mazad-accent" />
                </span>
                {t("eyebrow")}
              </>
            }
            title={t("title")}
            description={t("description")}
            actions={
              <>
                <AddAuctionButton size="lg" variant="heroPrimary" />
                <ButtonLink size="lg" variant="heroOutline" href={activeHref}>
                  {t("liveAuctions")}
                </ButtonLink>
                <ButtonLink size="lg" variant="heroOutline" href={routes.catalog}>
                  {t("exploreCatalog")}
                </ButtonLink>
              </>
            }
            footer={
              <AuctionSearch
                key={`${params.search ?? ""}-${params.status ?? ""}`}
                variant="hero"
                defaultQuery={params.search ?? ""}
                status={params.status}
                placeholder={t("searchPlaceholder")}
                buttonText={t("searchButton")}
              />
            }
            aside={
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-white/10">
                    <Gavel className="size-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-3xl font-bold tracking-tight">{data.count}</p>
                    <p className="text-xs font-medium text-white/70">{t("resultsCount")}</p>
                  </div>
                </div>
              </div>
            }
          />
        </ScrollReveal>

        {showLiveStrip ? <AuctionsLiveStrip auctions={liveData.results} /> : null}

        <MarketingSection
          title={t("browseTitle")}
          description={t("browseDescription")}
          badge={<Gavel className="size-5 text-mazad-primary" aria-hidden />}
        >
          <div className="mb-4 flex justify-end md:hidden">
            <AddAuctionButton size="sm" />
          </div>
          <FilterBar className="flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <AuctionStatusFilters
              currentStatus={params.status}
              search={params.search}
              sort={sort}
            />
            <AuctionSortFilters
              currentSort={sort}
              status={params.status}
              search={params.search}
            />
          </FilterBar>

          {sortedResults.length > 0 ? (
            <AnimatedAuctionGrid
              viewKey={[params.status ?? "all", params.search ?? "", sort].join("|")}
              auctions={sortedResults}
            />
          ) : (
            <EmptyState
              title={t("noResultsTitle")}
              description={t("noResultsDescription")}
            />
          )}
        </MarketingSection>
      </Container>
    );
  } catch {
    return (
      <Container>
        <ErrorState
          title={tErrors("genericTitle")}
          message={t("loadError")}
          onRetry={undefined}
        />
        <ButtonLink className="mt-4" variant="outline" href={routes.home}>
          {tCommon("backHome")}
        </ButtonLink>
      </Container>
    );
  }
}
