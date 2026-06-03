import { getTranslations } from "next-intl/server";

import { PageHeader } from "@mazad/ui";
import { UserProfileCard } from "@/components/profile/user-profile-card";

export async function generateMetadata() {
  const t = await getTranslations("profile");
  return { title: t("title") };
}

export default async function ProfilePage() {
  const t = await getTranslations("profile");

  return (
    <div className="space-y-8">
      <PageHeader title={t("title")} description={t("description")} />
      <div className="max-w-lg">
        <UserProfileCard />
      </div>
    </div>
  );
}
