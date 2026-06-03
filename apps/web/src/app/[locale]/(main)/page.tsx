import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { auctionsService } from "@mazad/api";
import { Container, PageHeader, HeroSection, EmptyState } from "@mazad/ui";
import { AuctionGrid } from "@/components/auctions/auction-grid";
import { ButtonLink } from "@/components/ui/button-link";

export default async function HomePage() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tMeta = await getTranslations("metadata");
  let auctions: Awaited<ReturnType<typeof auctionsService.list>>["results"] = [];

  try {
    const data = await auctionsService.list({
      status: "active",
      page_size: 6,
    });
    auctions = data.results;
  } catch {
    auctions = [];
  }

  return (
    <Container className="space-y-16 py-4">
      <HeroSection
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        primaryAction={
          <ButtonLink size="lg" href={routes.auctions}>
            {t("browseAuctions")}
          </ButtonLink>
        }
        secondaryAction={
          <ButtonLink size="lg" variant="outline" href={routes.catalog}>
            {t("exploreCatalog")}
          </ButtonLink>
        }
        visual={
          <div className="relative aspect-square max-w-md justify-self-end overflow-hidden rounded-2xl border border-separator bg-gradient-to-br from-mazad-primary/10 via-card to-light-blue/15 shadow-lg">
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <p className="text-sm font-semibold text-mazad-primary">{tMeta("siteName")}</p>
              <p className="mt-1 text-2xl font-bold text-navy">{t("activeAuctionsTitle")}</p>
            </div>
          </div>
        }
      />

      <section className="space-y-8">
        <PageHeader
          title={t("activeAuctionsTitle")}
          description={t("activeAuctionsDescription")}
          actions={
            <ButtonLink variant="outline" href={routes.auctions}>
              {tCommon("viewAll")}
            </ButtonLink>
          }
        />
        {auctions.length > 0 ? (
          <AuctionGrid auctions={auctions} />
        ) : (
          <EmptyState
            title={t("noActiveTitle")}
            description={t("noActiveDescription")}
            action={
              <ButtonLink href={routes.auctions}>{t("browseAllAuctions")}</ButtonLink>
            }
          />
        )}
      </section>
    </Container>
  );
}
