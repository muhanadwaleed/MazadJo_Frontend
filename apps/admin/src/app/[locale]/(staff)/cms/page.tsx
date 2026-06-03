import { getTranslations } from "next-intl/server";

import { StaffCmsPanel } from "@/components/staff-cms-panel";

export default async function CmsPage() {
  const t = await getTranslations("pages.cms");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <StaffCmsPanel />
    </div>
  );
}
