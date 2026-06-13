import { getTranslations } from "next-intl/server";
import { Bell } from "lucide-react";

import { NotificationsInbox } from "@/components/notifications/notifications-inbox";
import { MarketingPageShell } from "@/components/layout/marketing-page-shell";

export async function generateMetadata() {
  const t = await getTranslations("notifications");
  return { title: t("title") };
}

export default async function NotificationsPage() {
  const t = await getTranslations("notifications");

  return (
    <MarketingPageShell
      eyebrow={<Bell className="size-3.5" />}
      title={t("title")}
      description={t("description")}
    >
      <NotificationsInbox />
    </MarketingPageShell>
  );
}
