import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { PageHeader } from "@mazad/ui";
import { DashboardMyAuctions } from "@/components/dashboard/dashboard-my-auctions";
import { ButtonLink } from "@/components/ui/button-link";

export async function generateMetadata() {
  const t = await getTranslations("dashboard");
  return { title: t("title") };
}

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="space-y-10">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={routes.listingNew}>
              {t("createListing")}
            </ButtonLink>
            <ButtonLink variant="outline" href={routes.dashboardWatchlist}>
              {t("watchlist")}
            </ButtonLink>
          </div>
        }
      />
      <DashboardMyAuctions />
    </div>
  );
}
