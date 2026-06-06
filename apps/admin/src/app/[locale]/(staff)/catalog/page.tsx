import { getTranslations } from "next-intl/server";

import { StaffCatalogPanel } from "@/components/staff-catalog-panel";
import { StaffPageFrame } from "@/components/staff-page-frame";

export default async function CatalogPage() {
  const t = await getTranslations("pages.catalog");
  const tOverview = await getTranslations("overview");

  return (
    <StaffPageFrame
      eyebrow={tOverview("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <StaffCatalogPanel />
    </StaffPageFrame>
  );
}
