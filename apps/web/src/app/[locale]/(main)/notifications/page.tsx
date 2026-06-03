import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { Container } from "@mazad/ui";
import { PageHeader } from "@mazad/ui";
import { EmptyState } from "@/components/common/empty-state";
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
    <Container className="space-y-8">
      <PageHeader title={t("title")} description={t("comingSoon")} />
      <EmptyState
        title={t("title")}
        description={t("comingSoon")}
        action={
          <ButtonLink variant="outline" href={routes.dashboard}>
            {tDashboard("title")}
          </ButtonLink>
        }
      />
    </Container>
  );
}
