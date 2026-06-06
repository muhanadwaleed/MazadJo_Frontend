import { getTranslations } from "next-intl/server";

import { StaffConfigurationPanel } from "@/components/staff-configuration-panel";
import { StaffPageFrame } from "@/components/staff-page-frame";

export default async function ConfigurationPage() {
  const t = await getTranslations("pages.configuration");
  const tOverview = await getTranslations("overview");

  return (
    <StaffPageFrame
      eyebrow={tOverview("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <StaffConfigurationPanel />
    </StaffPageFrame>
  );
}
