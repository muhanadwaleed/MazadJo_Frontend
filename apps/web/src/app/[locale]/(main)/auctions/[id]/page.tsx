import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { auctionsService, catalogService } from "@mazad/api";
import type {
  AuctionDetail,
  AuctionListItem,
  AuctionStatus,
  PublicBid,
} from "@mazad/api";

import { AuctionDetailClient } from "@/components/auctions/detail/auction-detail-client";
import type { AuctionDetailData } from "@/components/auctions/detail/AuctionDetailPage";
import { resolveAuctionMediaPath } from "@/lib/auction-media-url";
import { intlLocale, isRtl } from "@/lib/locale";
import { normalizeMediaUrl } from "@/lib/media-url";

type PageProps = { params: Promise<{ id: string }> };

type DesignStatus = AuctionDetailData["status"];

/** Map the backend auction status onto the design's four visual states. */
function toDesignStatus(status: AuctionStatus): DesignStatus {
  switch (status) {
    case "active":
      return "active";
    case "scheduled":
    case "approved":
      return "scheduled";
    case "closed":
      return "sold";
    default:
      return "ended";
  }
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function relativeTime(iso: string, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), {
    numeric: "auto",
  });
  const diffMs = new Date(iso).getTime() - Date.now();
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
    ["second", 1_000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms || unit === "second") {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return rtf.format(0, "second");
}

function toNumber(value: string | number): number {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  return Number.isNaN(n) ? 0 : n;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("auctionDetail");
  try {
    const auction = await auctionsService.get(id);
    return { title: auction.title };
  } catch {
    return { title: t("fallbackTitle") };
  }
}

export default async function AuctionDetailRoute({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();

  let auction: AuctionDetail;
  let bidsResult: PublicBid[];
  try {
    const [detail, bids] = await Promise.all([
      auctionsService.get(id),
      auctionsService.bids(id, { page_size: 20 }),
    ]);
    auction = detail;
    bidsResult = bids.results;
  } catch {
    notFound();
  }

  // Category name (best-effort — falls back to no breadcrumb category).
  let categoryName: string | undefined;
  try {
    const category = await catalogService.category(auction.product_category);
    categoryName =
      locale === "ar" ? category.name_ar || category.name_en : category.name_en;
  } catch {
    categoryName = undefined;
  }

  // Similar auctions in the same category (best-effort).
  let similar: AuctionListItem[] = [];
  try {
    const list = await auctionsService.list({
      category: auction.product_category,
      page_size: 5,
    });
    similar = list.results
      .filter((item) => item.id !== auction.id)
      .slice(0, 4);
  } catch {
    similar = [];
  }

  const media = [...auction.media_items]
    .filter((item) => item.media_type === "image")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      url: resolveAuctionMediaPath(auction.id, item.id, item.url),
      alt: auction.title,
    }));

  const bids = bidsResult.map((bid) => ({
    id: String(bid.id),
    bidderName: bid.bidder,
    bidderInitials: initialsFrom(bid.bidder),
    amount: toNumber(bid.amount),
    placedAt: bid.timestamp,
    timeAgo: relativeTime(bid.timestamp, locale),
  }));

  const data: AuctionDetailData = {
    id: String(auction.id),
    title: auction.title,
    description: auction.description,
    status: toDesignStatus(auction.status),
    currentBid: toNumber(auction.current_price),
    startingPrice: toNumber(auction.start_price),
    // participants_count is unique bidders; use fetched bid rows for "bids placed".
    totalBids: bidsResult.length,
    minIncrement: toNumber(auction.min_bid_increment),
    endsAt: auction.ends_at ?? new Date().toISOString(),
    category: categoryName,
    location: auction.location_link || undefined,
    media,
    bids,
    similarAuctions: similar.map((item) => ({
      id: String(item.id),
      title: item.title,
      currentBid: toNumber(item.current_price),
      totalBids: item.participants_count,
      status: toDesignStatus(item.status),
      thumbnailUrl: normalizeMediaUrl(item.primary_media_url) ?? undefined,
    })),
  };

  return (
    <AuctionDetailClient
      auction={data}
      auctionId={auction.id}
      backendStatus={auction.status}
      sellerId={auction.seller}
      winnerBidId={auction.winner_bid}
      currency="JOD"
      isRtl={isRtl(locale)}
      isWatchlisted={auction.is_on_watchlist}
    />
  );
}
