import { getTranslations } from "next-intl/server";

import { StaffAuctionsReviewPanel } from "@/components/staff-auctions-review";

export default async function AuctionsReviewPage() {
  const t = await getTranslations("pages.auctionsReview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <StaffAuctionsReviewPanel />
    </div>
  );
}
