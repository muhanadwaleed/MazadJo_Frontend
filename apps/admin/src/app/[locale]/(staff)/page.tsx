import { getTranslations } from "next-intl/server";

import { StaffOverview } from "@mazad/ui";

import { staffNavItems } from "@/config/routes";

export default async function StaffHomePage() {
  const t = await getTranslations();

  const overviewItems = staffNavItems.slice(1).map((item) => ({
    label: t(item.labelKey),
    href: item.href,
    description: t("overview.openWorkspace"),
  }));

  return (
    <StaffOverview
      title={t("overview.title")}
      description={t("overview.description")}
      openWorkspaceLabel={t("overview.openWorkspace")}
      navItems={overviewItems}
    />
  );
}
