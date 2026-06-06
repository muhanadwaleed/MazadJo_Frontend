import { getTranslations } from "next-intl/server";

import { StaffPageFrame } from "@/components/staff-page-frame";
import { StaffProfileCard } from "@/components/staff-profile-card";

export async function generateMetadata() {
  const t = await getTranslations("profile");
  return { title: t("title") };
}

export default async function StaffProfilePage() {
  const t = await getTranslations("profile");
  const tOverview = await getTranslations("overview");

  return (
    <StaffPageFrame
      eyebrow={tOverview("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <div className="max-w-lg">
        <StaffProfileCard />
      </div>
    </StaffPageFrame>
  );
}
