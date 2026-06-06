import { getTranslations } from "next-intl/server";

import { StaffUsersPanel } from "@/components/staff-users-panel";
import { StaffPageFrame } from "@/components/staff-page-frame";

export default async function UsersPage() {
  const t = await getTranslations("pages.users");
  const tOverview = await getTranslations("overview");

  return (
    <StaffPageFrame
      eyebrow={tOverview("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <StaffUsersPanel />
    </StaffPageFrame>
  );
}
