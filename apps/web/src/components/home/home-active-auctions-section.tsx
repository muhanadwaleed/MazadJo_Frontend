import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";

import type { AuctionListItem } from "@mazad/api";
import { EmptyState, SectionHeader } from "@mazad/ui";
import { routes } from "@/config/routes";
import { AuctionCard } from "@/components/auctions/auction-card";
import {
  MotionStaggerGrid,
  MotionStaggerItem,
} from "@/components/common/motion-stagger";
import { ButtonLink } from "@/components/ui/button-link";
import { Link } from "@/i18n/navigation";

export async function HomeActiveAuctionsSection({
  auctions,
}: {
  auctions: AuctionListItem[];
}) {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <section className="space-y-6">
      <SectionHeader
        badge={
          <span className="flex size-2 rounded-full bg-mazad-accent animate-pulse" aria-hidden />
        }
        title={t("activeAuctionsTitle")}
        description={t("activeAuctionsDescription")}
        action={
          <Link
            href={routes.auctions}
            className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-mazad-primary transition-opacity duration-200 hover:opacity-85"
          >
            {tCommon("viewAll")}
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Link>
        }
      />

      {auctions.length > 0 ? (
        <MotionStaggerGrid
          as="div"
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-6 md:overflow-x-visible md:pb-0 md:snap-none lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
        >
          {auctions.map((auction) => (
            <MotionStaggerItem
              key={auction.id}
              as="div"
              className="h-full min-w-[290px] w-[290px] shrink-0 snap-start md:w-auto md:min-w-0 md:shrink"
            >
              <AuctionCard auction={auction} />
            </MotionStaggerItem>
          ))}
        </MotionStaggerGrid>
      ) : (
        <EmptyState
          title={t("noActiveTitle")}
          description={t("noActiveDescription")}
          action={<ButtonLink href={routes.auctions}>{t("browseAllAuctions")}</ButtonLink>}
        />
      )}
    </section>
  );
}
