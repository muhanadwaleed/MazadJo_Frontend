import { getTranslations } from "next-intl/server";
import { LayoutDashboard } from "lucide-react";

import { routes } from "@/config/routes";
import { DashboardMyAuctions } from "@/components/dashboard/dashboard-my-auctions";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";

export async function generateMetadata() {
  const t = await getTranslations("dashboard");
  return { title: t("title") };
}

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="space-y-10 py-2 md:py-4">
      <PageHero
        eyebrow={<LayoutDashboard className="size-3.5" />}
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <ButtonLink size="lg" variant="heroPrimary" href={routes.listingNew}>
              {t("createListing")}
            </ButtonLink>
            <ButtonLink size="lg" variant="heroOutline" href={routes.dashboardWatchlist}>
              {t("watchlist")}
            </ButtonLink>
          </>
        }
      />
      <DashboardMyAuctions />
    </div>
  );
}
