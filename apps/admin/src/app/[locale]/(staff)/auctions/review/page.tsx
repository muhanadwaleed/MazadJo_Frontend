import { getTranslations } from "next-intl/server";

import { StaffAuctionsReviewPanel } from "@/components/staff-auctions-review";
import { StaffPageFrame } from "@/components/staff-page-frame";

export default async function AuctionsReviewPage() {
  const t = await getTranslations("pages.auctionsReview");
  const tOverview = await getTranslations("overview");

  return (
    <StaffPageFrame
      eyebrow={tOverview("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <StaffAuctionsReviewPanel />
    </StaffPageFrame>
  );
}
