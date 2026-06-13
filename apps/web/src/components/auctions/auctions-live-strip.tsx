import type { AuctionListItem } from "@mazad/api";
import { getLocale, getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { formatMoney } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { AuctionStatusBadge } from "@/components/auctions/auction-status-badge";
import { CountdownTimer, LiveAuctionIndicator } from "@mazad/ui";

type AuctionsLiveStripProps = {
  auctions: AuctionListItem[];
};

export async function AuctionsLiveStrip({ auctions }: AuctionsLiveStripProps) {
  const locale = await getLocale();
  const t = await getTranslations("auctions");

  if (auctions.length === 0) return null;

  return (
    <ScrollReveal variant="fadeInUp">
      <section aria-label={t("liveStripTitle")} className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LiveAuctionIndicator />
            <h2 className="text-lg font-bold text-navy">{t("liveStripTitle")}</h2>
          </div>
          <Link
            href="/auctions?status=active"
            className="text-sm font-semibold text-mazad-primary transition-opacity duration-200 hover:opacity-85"
          >
            {t("liveStripViewAll")}
          </Link>
        </div>
        <ul className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {auctions.map((auction) => (
            <li key={auction.id} className="w-72 shrink-0">
              <Link
                href={routes.auction(auction.id)}
                className="block rounded-2xl border border-separator/60 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-mazad-primary/30 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <AuctionStatusBadge status={auction.status} />
                  <span className="text-xs font-medium text-muted-foreground">
                    #{auction.auction_number}
                  </span>
                </div>
                <p className="line-clamp-2 font-semibold text-navy">{auction.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("currentBid")}</p>
                <p className="text-xl font-bold text-navy">
                  {formatMoney(auction.current_price, locale)}
                </p>
                <div className="mt-3 rounded-xl border border-mazad-accent/20 bg-mazad-accent/5 p-2">
                  {auction.ends_at ? (
                    <CountdownTimer
                      endsAt={auction.ends_at}
                      labels={{
                        days: t("countdown.days"),
                        hours: t("countdown.hours"),
                        minutes: t("countdown.minutes"),
                        seconds: t("countdown.seconds"),
                      }}
                    />
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ScrollReveal>
  );
}
