"use client";

/**
 * AuctionDetailPage
 * Full auction detail page presentation. Wires the media gallery, sticky bid
 * panel and animated bid history together.
 *
 * Text is resolved via next-intl (this is a Client Component), so it is fully
 * translated and RTL-aware. Map your API response onto the `auction` prop.
 */

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Tag, Star, BadgeCheck, ChevronRight, Trophy } from "lucide-react";
import type { AuctionStatus } from "@mazad/api";
import { Badge, Card } from "@mazad/ui";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { intlLocale } from "@/lib/locale";
import { AuctionMediaGallery, type AuctionMedia } from "./AuctionMediaGallery";
import { AuctionBidPanel, type RecentBid } from "./AuctionBidPanel";
import { AuctionBidHistory, type BidRecord } from "./AuctionBidHistory";

/* ─── Types ──────────────────────────────────────────────────── */
export interface AuctionDetailData {
  id: string;
  title: string;
  description: string;
  status: "active" | "scheduled" | "ended" | "sold";
  currentBid: number;
  startingPrice: number;
  totalBids: number;
  minIncrement: number;
  endsAt: Date | string;
  category?: string;
  condition?: string;
  location?: string;
  media: AuctionMedia[];
  /** Optional — the public API may not expose seller profile details. */
  seller?: {
    displayName: string;
    initials: string;
    rating: number;
    totalSales: number;
    verified: boolean;
  };
  bids: (RecentBid & BidRecord)[];
  similarAuctions?: {
    id: string;
    title: string;
    currentBid: number;
    totalBids: number;
    status: "active" | "scheduled" | "ended" | "sold";
    thumbnailUrl?: string;
  }[];
}

interface AuctionDetailPageProps {
  auction: AuctionDetailData;
  currency?: string;
  onBid?: (amount: number) => Promise<void> | void;
  onWatchlist?: (watched: boolean) => void;
  isWatchlisted?: boolean;
  /** RTL locale? pass true when locale === "ar" */
  isRtl?: boolean;
  /** Phase 5 — payment / subscribe panel (replaces bid form when required) */
  subscriptionGate?: ReactNode;
  /** Hide bid form when user must pay to join first */
  hideBidPanel?: boolean;
  /** Phase 7 — backend status for settlement messaging */
  backendStatus?: AuctionStatus;
  winnerBidId?: number | null;
}

/* ─── Helpers ────────────────────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };

function DetailMeta({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p
        className="mb-1 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--mazad-muted-foreground, #8896AA)" }}
      >
        {label}
      </p>
      <p className="text-sm font-medium" style={{ color: "var(--mazad-navy)" }}>
        {value}
      </p>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export function AuctionDetailPage({
  auction,
  currency = "JOD",
  onBid,
  onWatchlist,
  isWatchlisted = false,
  isRtl = false,
  subscriptionGate,
  hideBidPanel = false,
  backendStatus,
  winnerBidId,
}: AuctionDetailPageProps) {
  const locale = useLocale();
  const t = useTranslations("auctionDetail");
  const tAuctions = useTranslations("auctions");
  const tBids = useTranslations("bids");
  const totalBidCount =
    auction.bids.length > 0 ? auction.bids.length : auction.totalBids;
  const tBidForm = useTranslations("bidForm");

  const numberLocale = intlLocale(locale);
  const fmt = (n: number) => n.toLocaleString(numberLocale);
  const formatDate = (value: Date | string) =>
    new Intl.DateTimeFormat(numberLocale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));

  /* Status badge */
  const statusVariant = (
    auction.status === "active"
      ? "live"
      : auction.status === "scheduled"
        ? "active"
        : auction.status === "sold"
          ? "sold"
          : "draft"
  ) as "live" | "active" | "sold" | "draft";

  const statusLabel =
    auction.status === "active"
      ? tAuctions("status.active")
      : auction.status === "scheduled"
        ? tAuctions("status.scheduled")
        : auction.status === "sold"
          ? tAuctions("status.cancelled")
          : tAuctions("status.ended");

  const panelLabels = {
    liveAuction: t("liveAuction"),
    currentBid: t("currentPrice"),
    bids: t("bidsWord"),
    startingPrice: tAuctions("startingPrice"),
    timeRemaining: t("timeRemaining"),
    yourBid: t("yourBid"),
    minBid: t("minBidShort", {
      amount: `${currency} ${fmt(auction.currentBid + auction.minIncrement)}`,
    }),
    placeBid: tBidForm("placeBid"),
    placingBid: t("placingBid"),
    addToWatchlist: t("watchlistAdd"),
    removeFromWatchlist: t("watchlistRemove"),
    recentBids: tBids("recentBids"),
    securePay: t("securePay"),
    verifiedSeller: t("verifiedSeller"),
    instantAlerts: t("instantAlerts"),
    days: tAuctions("countdown.days"),
    hours: tAuctions("countdown.hours"),
    minutes: tAuctions("countdown.minutes"),
    seconds: tAuctions("countdown.seconds"),
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--mazad-surface, #F7F9FC)" }}>
      {/* Breadcrumb */}
      <div
        className="border-b"
        style={{
          borderColor: "var(--mazad-separator)",
          background: "var(--mazad-white)",
        }}
      >
        <div className="container mx-auto flex items-center gap-1.5 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <Link
            href={routes.auctions}
            className="transition-colors hover:underline"
            style={{ color: "var(--mazad-muted-foreground)" }}
          >
            {tAuctions("title")}
          </Link>
          {auction.category ? (
            <>
              <ChevronRight
                className="size-3.5"
                style={{
                  color: "var(--mazad-muted-foreground)",
                  transform: isRtl ? "scaleX(-1)" : undefined,
                }}
              />
              <span style={{ color: "var(--mazad-muted-foreground)" }}>
                {auction.category}
              </span>
            </>
          ) : null}
          <ChevronRight
            className="size-3.5"
            style={{
              color: "var(--mazad-muted-foreground)",
              transform: isRtl ? "scaleX(-1)" : undefined,
            }}
          />
          <span style={{ color: "var(--mazad-navy)" }} className="line-clamp-1 font-medium">
            {auction.title}
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="container mx-auto px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {(backendStatus === "ended" ||
          backendStatus === "closed" ||
          backendStatus === "delivery_in_progress") &&
        winnerBidId ? (
          <div
            className="mb-6 flex items-start gap-3 rounded-2xl border p-4"
            style={{
              borderColor: "color-mix(in srgb, var(--mazad-accent) 35%, transparent)",
              background: "color-mix(in srgb, var(--mazad-accent) 8%, white)",
            }}
          >
            <Trophy className="mt-0.5 size-5 shrink-0 text-mazad-accent" aria-hidden />
            <div>
              <p className="font-semibold text-mazad-navy">{t("winnerAnnounced")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("winnerAnnouncedHint")}</p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT COLUMN */}
          <motion.div
            className="flex flex-col gap-5"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {/* Status + category row */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <Badge variant={statusVariant} className="gap-1.5">
                {auction.status === "active" && (
                  <span
                    className="mazad-live-dot size-1.5 rounded-full"
                    style={{ background: "currentColor" }}
                  />
                )}
                {statusLabel}
              </Badge>
              {auction.category ? (
                <span className="text-sm" style={{ color: "var(--mazad-muted-foreground)" }}>
                  {auction.category}
                </span>
              ) : null}
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-2xl font-extrabold leading-tight sm:text-3xl"
              style={{ color: "var(--mazad-navy)" }}
            >
              {auction.title}
            </motion.h1>

            {/* Media gallery */}
            <motion.div variants={fadeUp}>
              <AuctionMediaGallery images={auction.media} title={auction.title} />
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeUp}>
              <Card className="rounded-2xl border p-6" style={{ borderColor: "var(--mazad-separator)" }}>
                <h2 className="mb-3 text-base font-bold" style={{ color: "var(--mazad-navy)" }}>
                  {t("description")}
                </h2>
                <p
                  className="text-sm leading-7"
                  style={{ color: "var(--mazad-muted-foreground, #4A5568)" }}
                >
                  {auction.description || t("noDescription")}
                </p>
              </Card>
            </motion.div>

            {/* Auction details grid */}
            <motion.div variants={fadeUp}>
              <Card className="rounded-2xl border p-6" style={{ borderColor: "var(--mazad-separator)" }}>
                <h2 className="mb-5 text-base font-bold" style={{ color: "var(--mazad-navy)" }}>
                  {t("auctionDetails")}
                </h2>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                  {auction.condition ? (
                    <DetailMeta label={t("condition")} value={auction.condition} />
                  ) : null}
                  {auction.location ? (
                    <DetailMeta
                      label={t("location")}
                      value={
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5" style={{ color: "var(--mazad-primary)" }} />
                          {auction.location}
                        </span>
                      }
                    />
                  ) : null}
                  {auction.category ? (
                    <DetailMeta
                      label={t("category")}
                      value={
                        <span className="flex items-center gap-1">
                          <Tag className="size-3.5" style={{ color: "var(--mazad-primary)" }} />
                          {auction.category}
                        </span>
                      }
                    />
                  ) : null}
                  <DetailMeta
                    label={tAuctions("startingPrice")}
                    value={`${currency} ${fmt(auction.startingPrice)}`}
                  />
                  <DetailMeta
                    label={t("totalBids")}
                    value={t("bidsPlaced", { count: totalBidCount })}
                  />
                  <DetailMeta label={t("auctionEnds")} value={formatDate(auction.endsAt)} />
                </div>
              </Card>
            </motion.div>

            {/* Seller card — only when the API provides profile data */}
            {auction.seller ? (
              <motion.div variants={fadeUp}>
                <Card className="rounded-2xl border p-6" style={{ borderColor: "var(--mazad-separator)" }}>
                  <h2 className="mb-4 text-base font-bold" style={{ color: "var(--mazad-navy)" }}>
                    {t("seller")}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--mazad-primary), var(--mazad-navy))",
                      }}
                    >
                      {auction.seller.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: "var(--mazad-navy)" }}>
                          {auction.seller.displayName}
                        </span>
                        {auction.seller.verified && (
                          <span
                            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                            style={{
                              background:
                                "color-mix(in srgb, var(--mazad-primary) 10%, transparent)",
                              color: "var(--mazad-primary)",
                            }}
                          >
                            <BadgeCheck className="size-3" />
                            {t("verified")}
                          </span>
                        )}
                      </div>
                      <p
                        className="mt-0.5 flex items-center gap-1 text-sm"
                        style={{ color: "var(--mazad-muted-foreground)" }}
                      >
                        <Star className="size-3.5 fill-current" style={{ color: "#F59E0B" }} />
                        {t("sellerStats", {
                          rating: auction.seller.rating,
                          count: auction.seller.totalSales,
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : null}

            {/* Full bid history */}
            <motion.div variants={fadeUp}>
              <AuctionBidHistory
                bids={auction.bids}
                currency={currency}
                numberLocale={numberLocale}
                label={t("bidHistory")}
                emptyLabel={t("noBidsYet")}
              />
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN — payment gate or bid panel */}
          <div id="auction-bid-panel" className="flex flex-col gap-4">
            {subscriptionGate}
            {!hideBidPanel ? (
              <AuctionBidPanel
                auctionId={auction.id}
                title={auction.title}
                status={auction.status}
                currentBid={auction.currentBid}
                startingPrice={auction.startingPrice}
                totalBids={totalBidCount}
                minIncrement={auction.minIncrement}
                endsAt={auction.endsAt}
                isWatchlisted={isWatchlisted}
                bids={auction.bids}
                currency={currency}
                numberLocale={numberLocale}
                onBid={onBid}
                onWatchlist={onWatchlist}
                labels={panelLabels}
              />
            ) : null}
          </div>
        </div>

        {/* Similar auctions */}
        {(auction.similarAuctions?.length ?? 0) > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 text-xl font-extrabold" style={{ color: "var(--mazad-navy)" }}>
              {t("similarAuctions")}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {auction.similarAuctions!.map((item) => (
                <Link key={item.id} href={routes.auction(item.id)}>
                  <motion.div
                    className="group cursor-pointer overflow-hidden rounded-2xl border transition-shadow duration-200"
                    style={{
                      background: "var(--mazad-white)",
                      borderColor: "var(--mazad-separator)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                    whileHover={{
                      y: -4,
                      boxShadow: "var(--shadow-card-hover, 0 16px 40px rgba(11,30,60,0.10))",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="flex aspect-[4/3] items-center justify-center"
                      style={{
                        background: item.thumbnailUrl
                          ? undefined
                          : "linear-gradient(135deg, #1a2a4a 0%, #0f1c35 100%)",
                      }}
                    >
                      {item.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <span className="text-4xl font-black text-white/20">M</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      {item.status === "active" && (
                        <div className="mb-1.5 flex items-center gap-1.5">
                          <span
                            className="mazad-live-dot size-1.5 rounded-full"
                            style={{ background: "var(--mazad-accent, #FF6A00)" }}
                          />
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: "var(--mazad-accent)" }}
                          >
                            {t("liveNow")}
                          </span>
                        </div>
                      )}
                      <p
                        className="mb-1 line-clamp-2 text-xs font-semibold leading-snug"
                        style={{ color: "var(--mazad-navy)" }}
                      >
                        {item.title}
                      </p>
                      <p className="text-sm font-black" style={{ color: "var(--mazad-navy)" }}>
                        {currency} {fmt(item.currentBid)}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--mazad-muted-foreground)" }}>
                        {t("bidsPlaced", { count: item.totalBids })}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
