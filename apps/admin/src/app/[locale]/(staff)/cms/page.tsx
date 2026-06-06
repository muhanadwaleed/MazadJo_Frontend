import { getTranslations } from "next-intl/server";

import { StaffCmsPanel } from "@/components/staff-cms-panel";
import { StaffPageFrame } from "@/components/staff-page-frame";

export default async function CmsPage() {
  const t = await getTranslations("pages.cms");
  const tOverview = await getTranslations("overview");

  return (
    <StaffPageFrame
      eyebrow={tOverview("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <StaffCmsPanel />
    </StaffPageFrame>
  );
}
