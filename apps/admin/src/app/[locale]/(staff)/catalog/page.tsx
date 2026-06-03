import { getTranslations } from "next-intl/server";

import { StaffCatalogPanel } from "@/components/staff-catalog-panel";

export default async function CatalogPage() {
  const t = await getTranslations("pages.catalog");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <StaffCatalogPanel />
    </div>
  );
}
