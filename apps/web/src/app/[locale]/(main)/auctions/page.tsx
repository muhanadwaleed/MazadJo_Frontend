import { getTranslations } from "next-intl/server";
import { Gavel } from "lucide-react";

import { routes } from "@/config/routes";
import { auctionsService } from "@mazad/api";
import { Container, EmptyState, FilterBar, SectionHeader } from "@mazad/ui";
import { AnimatedAuctionGrid } from "@/components/auctions/animated-auction-grid";
import { AuctionSearch } from "@/components/auctions/auction-search";
import { AuctionStatusFilters } from "@/components/auctions/auction-status-filters";
import { ErrorState } from "@/components/common/error-state";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";

type SearchParams = Promise<{ status?: string; search?: string }>;

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

  try {
    const data = await auctionsService.list({
      status: params.status,
      search: params.search,
      page_size: 24,
    });

    const activeHref = params.search
      ? `/auctions?status=active&search=${encodeURIComponent(params.search)}`
      : "/auctions?status=active";

    return (
      <Container className="space-y-8 py-2 md:py-4">
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
              <ButtonLink size="lg" variant="heroPrimary" href={activeHref}>
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

        <section className="space-y-6">
          <SectionHeader
            title={t("browseTitle")}
            description={t("browseDescription")}
          />

          <FilterBar>
            <AuctionStatusFilters
              currentStatus={params.status}
              search={params.search}
            />
          </FilterBar>

          {data.results.length > 0 ? (
            <AnimatedAuctionGrid auctions={data.results} />
          ) : (
            <EmptyState
              title={t("noResultsTitle")}
              description={t("noResultsDescription")}
            />
          )}
        </section>
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
