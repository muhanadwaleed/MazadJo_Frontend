import { getTranslations } from "next-intl/server";

import { StaffSubscriptionsStagingPanel } from "@/components/staff-subscriptions-staging";

export async function generateMetadata() {
  const t = await getTranslations("pages.subscriptionsStaging");
  return { title: t("title") };
}

export default async function SubscriptionsStagingPage() {
  const t = await getTranslations("pages.subscriptionsStaging");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <StaffSubscriptionsStagingPanel />
    </div>
  );
}
