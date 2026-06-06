import { getTranslations } from "next-intl/server";

import { StaffOverview } from "@mazad/ui";

import { staffNavIcons } from "@/config/nav-icons";
import { staffNavItems } from "@/config/routes";

export default async function StaffHomePage() {
  const t = await getTranslations();

  const overviewItems = staffNavItems.slice(1).map((item) => {
    const Icon = staffNavIcons[item.icon];
    return {
      label: t(item.labelKey),
      href: item.href,
      description: t("overview.openWorkspace"),
      icon: <Icon className="size-5" aria-hidden />,
    };
  });

  return (
    <StaffOverview
      title={t("overview.title")}
      description={t("overview.description")}
      eyebrow={t("overview.eyebrow")}
      openWorkspaceLabel={t("overview.openWorkspace")}
      navItems={overviewItems}
    />
  );
}
