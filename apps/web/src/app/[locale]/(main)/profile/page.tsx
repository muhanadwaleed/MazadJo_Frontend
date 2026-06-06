import { getTranslations } from "next-intl/server";
import { UserRound } from "lucide-react";

import { ContentSection } from "@mazad/ui";
import { MarketingPageShell } from "@/components/layout/marketing-page-shell";
import { UserProfileCard } from "@/components/profile/user-profile-card";

export async function generateMetadata() {
  const t = await getTranslations("profile");
  return { title: t("title") };
}

export default async function ProfilePage() {
  const t = await getTranslations("profile");

  return (
    <MarketingPageShell
      contained={false}
      eyebrow={<UserRound className="size-3.5" />}
      title={t("title")}
      description={t("description")}
    >
      <ContentSection title={t("cardTitle")} icon={<UserRound className="size-6 stroke-[1.75]" />}>
        <div className="max-w-lg">
          <UserProfileCard />
        </div>
      </ContentSection>
    </MarketingPageShell>
  );
}
