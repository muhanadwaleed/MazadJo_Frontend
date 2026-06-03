import { getTranslations } from "next-intl/server";

import { StaffAuctionsPublishPanel } from "@/components/staff-auctions-publish";

export default async function AuctionsPublishPage() {
  const t = await getTranslations("pages.auctionsPublish");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <StaffAuctionsPublishPanel />
    </div>
  );
}
