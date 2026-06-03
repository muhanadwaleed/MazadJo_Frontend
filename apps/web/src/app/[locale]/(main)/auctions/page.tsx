import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { auctionsService } from "@mazad/api";
import { Container } from "@mazad/ui";
import { PageHeader } from "@mazad/ui";
import { AuctionGrid } from "@/components/auctions/auction-grid";
import { EmptyState } from "@mazad/ui";
import { ErrorState } from "@/components/common/error-state";
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

    return (
      <Container className="space-y-8">
        <PageHeader title={t("title")} description={t("description")} />
        {data.results.length > 0 ? (
          <AuctionGrid auctions={data.results} />
        ) : (
          <EmptyState
            title={t("noResultsTitle")}
            description={t("noResultsDescription")}
          />
        )}
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
