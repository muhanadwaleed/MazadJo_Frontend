import { getTranslations } from "next-intl/server";
import { Bell } from "lucide-react";

import { routes } from "@/config/routes";
import { EmptyState } from "@/components/common/empty-state";
import { MarketingPageShell } from "@/components/layout/marketing-page-shell";
import { ButtonLink } from "@/components/ui/button-link";

export async function generateMetadata() {
  const t = await getTranslations("notifications");
  return { title: t("title") };
}

/** Route reserved — notificationsService is ready for Phase 6. */
export default async function NotificationsPage() {
  const t = await getTranslations("notifications");
  const tDashboard = await getTranslations("dashboard");

  return (
    <MarketingPageShell
      eyebrow={<Bell className="size-3.5" />}
      title={t("title")}
      description={t("comingSoon")}
    >
      <EmptyState
        title={t("title")}
        description={t("comingSoon")}
        action={
          <ButtonLink variant="outline" href={routes.dashboard}>
            {tDashboard("title")}
          </ButtonLink>
        }
      />
    </MarketingPageShell>
  );
}
