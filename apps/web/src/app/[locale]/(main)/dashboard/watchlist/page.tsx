import { getTranslations } from "next-intl/server";
import { Bookmark } from "lucide-react";

import { WatchlistAuctions } from "@/components/dashboard/watchlist-auctions";
import { MarketingPageShell } from "@/components/layout/marketing-page-shell";

export async function generateMetadata() {
  const t = await getTranslations("watchlist");
  return { title: t("title") };
}

export default async function WatchlistPage() {
  const t = await getTranslations("watchlist");

  return (
    <MarketingPageShell
      contained={false}
      eyebrow={<Bookmark className="size-3.5" />}
      title={t("title")}
      description={t("description")}
    >
      <WatchlistAuctions />
    </MarketingPageShell>
  );
}
