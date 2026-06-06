import { getTranslations } from "next-intl/server";

import { StaffAuctionsPublishPanel } from "@/components/staff-auctions-publish";
import { StaffPageFrame } from "@/components/staff-page-frame";

export default async function AuctionsPublishPage() {
  const t = await getTranslations("pages.auctionsPublish");
  const tOverview = await getTranslations("overview");

  return (
    <StaffPageFrame
      eyebrow={tOverview("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <StaffAuctionsPublishPanel />
    </StaffPageFrame>
  );
}
