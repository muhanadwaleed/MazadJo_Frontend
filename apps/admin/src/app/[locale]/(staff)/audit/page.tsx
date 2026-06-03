import { getTranslations } from "next-intl/server";

import { StaffAuditPanel } from "@/components/staff-audit-panel";

type AuditPageProps = {
  searchParams: Promise<{ entity_id?: string; entity_type?: string }>;
};

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const params = await searchParams;
  const t = await getTranslations("pages.audit");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <StaffAuditPanel
        initialEntityId={params.entity_id ?? ""}
        initialEntityType={params.entity_type ?? "auction"}
      />
    </div>
  );
}
