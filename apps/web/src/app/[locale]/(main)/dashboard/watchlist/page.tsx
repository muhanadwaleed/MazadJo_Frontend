import { getTranslations } from "next-intl/server";
import { Bell, Bookmark } from "lucide-react";

import { routes } from "@/config/routes";
import { EmptyState } from "@/components/common/empty-state";
import { MarketingPageShell } from "@/components/layout/marketing-page-shell";
import { ButtonLink } from "@/components/ui/button-link";

export async function generateMetadata() {
  const t = await getTranslations("watchlist");
  return { title: t("title") };
}

export default async function WatchlistPage() {
  const t = await getTranslations("watchlist");
  const tHome = await getTranslations("home");

  return (
    <MarketingPageShell
      contained={false}
      eyebrow={<Bookmark className="size-3.5" />}
      title={t("title")}
      description={t("description")}
    >
      <EmptyState
        title={t("comingSoon")}
        description={t("comingSoon")}
        action={
          <ButtonLink href={routes.auctions}>{tHome("browseAuctions")}</ButtonLink>
        }
      />
    </MarketingPageShell>
  );
}
