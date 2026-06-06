import { getTranslations } from "next-intl/server";

import { StaffAuditPanel } from "@/components/staff-audit-panel";
import { StaffPageFrame } from "@/components/staff-page-frame";

type PageProps = {
  searchParams: Promise<{ entity_type?: string; entity_id?: string }>;
};

export default async function AuditPage({ searchParams }: PageProps) {
  const t = await getTranslations("pages.audit");
  const tOverview = await getTranslations("overview");
  const params = await searchParams;

  return (
    <StaffPageFrame
      eyebrow={tOverview("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <StaffAuditPanel
        initialEntityType={params.entity_type}
        initialEntityId={params.entity_id}
      />
    </StaffPageFrame>
  );
}
