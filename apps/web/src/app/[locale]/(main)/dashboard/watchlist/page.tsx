import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { PageHeader } from "@mazad/ui";
import { EmptyState } from "@/components/common/empty-state";
import { ButtonLink } from "@/components/ui/button-link";

export async function generateMetadata() {
  const t = await getTranslations("watchlist");
  return { title: t("title") };
}

export default async function WatchlistPage() {
  const t = await getTranslations("watchlist");
  const tHome = await getTranslations("home");

  return (
    <div className="space-y-8">
      <PageHeader title={t("title")} description={t("description")} />
      <EmptyState
        title={t("comingSoon")}
        description={t("comingSoon")}
        action={
          <ButtonLink href={routes.auctions}>{tHome("browseAuctions")}</ButtonLink>
        }
      />
    </div>
  );
}
