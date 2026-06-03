import { getTranslations } from "next-intl/server";

import { StaffUsersPanel } from "@/components/staff-users-panel";

export default async function UsersPage() {
  const t = await getTranslations("pages.users");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <StaffUsersPanel />
    </div>
  );
}
