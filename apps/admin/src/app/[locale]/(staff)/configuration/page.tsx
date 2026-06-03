import { getTranslations } from "next-intl/server";

import { StaffConfigurationPanel } from "@/components/staff-configuration-panel";

export default async function ConfigurationPage() {
  const t = await getTranslations("pages.configuration");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <StaffConfigurationPanel />
    </div>
  );
}
