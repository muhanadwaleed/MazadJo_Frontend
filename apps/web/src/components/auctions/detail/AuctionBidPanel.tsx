"use client";

/**
 * AuctionBidPanel
 * Sticky right-column bid panel: gradient header, animated countdown,
 * bid input, CTA, mini bid feed, trust badges.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Zap, Lock } from "lucide-react";
import { Avatar, AvatarFallback, Button, Input } from "@mazad/ui";
import { AuctionCountdown } from "./AuctionCountdown";

/* ─── Types ──────────────────────────────────────────────────── */
export interface RecentBid {
  id: string;
  bidderName: string; // masked or display name
  bidderInitials: string;
  amount: number;
  placedAt: Date | string;
  timeAgo: string; // pre-formatted relative time, e.g. "2 min ago"
}

export interface AuctionBidPanelProps {
  auctionId: string;
  title: string;
  status: "active" | "scheduled" | "ended" | "sold";
  currentBid: number;
  startingPrice: number;
  totalBids: number;
  minIncrement: number; // minimum raise above current bid
  endsAt: Date | string;
  isWatchlisted?: boolean;
  bids: RecentBid[];
  currency?: string; // default "JOD"
  numberLocale?: string;
  /** Called with the bid amount when the user submits */
  onBid?: (amount: number) => Promise<void> | void;
  /** Called when watchlist button is toggled */
  onWatchlist?: (watched: boolean) => void;
  /** Pass translated labels for RTL/i18n */
  labels?: {
    liveAuction?: string;
    currentBid?: string;
    bids?: string;
    startingPrice?: string;
    timeRemaining?: string;
    yourBid?: string;
    minBid?: string;
    placeBid?: string;
    placingBid?: string;
    addToWatchlist?: string;
    removeFromWatchlist?: string;
    recentBids?: string;
    securePay?: string;
    verifiedSeller?: string;
    instantAlerts?: string;
    minBidError?: string;
    bidFailed?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
  };
}

/* ─── Component ─────────────────────────────────────────────── */
export function AuctionBidPanel({
  status,
  currentBid,
  startingPrice,
  totalBids,
  minIncrement,
  endsAt,
  isWatchlisted = false,
  bids,
  currency = "JOD",
  numberLocale = "en-JO",
  onBid,
  onWatchlist,
  labels = {},
}: AuctionBidPanelProps) {
  const [bidValue, setBidValue] = useState("");
  const [watched, setWatched] = useState(isWatchlisted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLive = status === "active";
  const minBid = currentBid + minIncrement;
  const fmt = (n: number) =>
    n.toLocaleString(numberLocale, { minimumFractionDigits: 0 });

  const L = {
    liveAuction: labels.liveAuction ?? "Live Auction",
    currentBid: labels.currentBid ?? "Current Bid",
    bids: labels.bids ?? "bids",
    startingPrice: labels.startingPrice ?? "Starting",
    timeRemaining: labels.timeRemaining ?? "Time Remaining",
    yourBid: labels.yourBid ?? "Your Bid",
    minBid: labels.minBid ?? `Min. ${currency} ${fmt(minBid)}`,
    placeBid: labels.placeBid ?? "Place Bid",
    placingBid: labels.placingBid ?? "Placing bid…",
    addToWatchlist: labels.addToWatchlist ?? "Add to Watchlist",
    removeFromWatchlist: labels.removeFromWatchlist ?? "Remove from Watchlist",
    recentBids: labels.recentBids ?? "Recent Bids",
    securePay: labels.securePay ?? "Secure Payment",
    verifiedSeller: labels.verifiedSeller ?? "Verified Seller",
    instantAlerts: labels.instantAlerts ?? "Instant Alerts",
    minBidError:
      labels.minBidError ?? `Minimum bid is ${currency} ${fmt(minBid)}`,
    bidFailed: labels.bidFailed ?? "Failed to place bid",
    hours: labels.hours ?? "Hours",
    minutes: labels.minutes ?? "Mins",
    seconds: labels.seconds ?? "Secs",
  };

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleBid = async () => {
    const amount = parseFloat(bidValue);
    if (isNaN(amount) || amount < minBid) {
      setError(L.minBidError);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onBid?.(amount);
      setBidValue("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : L.bidFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlist = () => {
    const next = !watched;
    setWatched(next);
    onWatchlist?.(next);
  };

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <motion.div
      className="sticky top-20 overflow-hidden rounded-2xl border"
      style={{
        background: "var(--mazad-white, #ffffff)",
        borderColor: "var(--mazad-separator, #E7EAF0)",
        boxShadow:
          "var(--shadow-lg, 0 12px 32px rgba(11,30,60,0.08), 0 4px 8px rgba(11,30,60,0.04))",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Panel header (gradient) */}
      <div
        className="relative overflow-hidden px-6 py-5"
        style={{
          background:
            "linear-gradient(135deg, var(--mazad-primary,#1E5ECB) 0%, #0F4CBA 50%, var(--mazad-navy,#071328) 100%)",
        }}
      >
        {/* Orange ambient glow */}
        <div
          className="pointer-events-none absolute -end-5 -top-5 size-28 rounded-full"
          style={{
            background: "color-mix(in srgb, var(--mazad-accent) 18%, transparent)",
            filter: "blur(22px)",
          }}
        />

        {/* Live indicator */}
        {isLive && (
          <div className="mb-3 flex items-center gap-2">
            <span
              className="mazad-live-dot size-2 rounded-full"
              style={{ background: "var(--mazad-accent, #FF6A00)" }}
            />
            <span className="text-xs font-bold uppercase tracking-widest text-white/90">
              {L.liveAuction}
            </span>
          </div>
        )}

        {/* Current bid */}
        <p className="mb-1 text-xs text-white/60">{L.currentBid}</p>
        <p
          className="mazad-bid-flash text-4xl font-black tracking-tight text-white"
          key={currentBid} /* re-triggers flash animation on bid update */
        >
          {currency} {fmt(currentBid)}
        </p>
        <p className="mt-1 text-xs text-white/50">
          {totalBids} {L.bids} · {L.startingPrice} {currency} {fmt(startingPrice)}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 p-6">
        {/* Countdown */}
        {isLive && (
          <div>
            <p
              className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--mazad-muted-foreground, #8896AA)" }}
            >
              {L.timeRemaining}
            </p>
            <AuctionCountdown
              endTime={endsAt}
              labels={{ hours: L.hours, minutes: L.minutes, seconds: L.seconds }}
            />
          </div>
        )}

        {/* Bid input */}
        {isLive && (
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-semibold"
              style={{ color: "var(--mazad-muted-foreground, #6B7280)" }}
            >
              {L.yourBid} — {L.minBid}
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-base font-bold"
                style={{ color: "var(--mazad-muted-foreground, #6B7280)" }}
              >
                {currency}
              </span>
              <Input
                type="number"
                inputMode="numeric"
                placeholder={String(minBid)}
                value={bidValue}
                onChange={(e) => {
                  setBidValue(e.target.value);
                  setError(null);
                }}
                className="h-12 rounded-xl ps-14 text-base font-semibold"
                style={{ background: "var(--mazad-surface, #F7F9FC)" }}
                min={minBid}
                step={minIncrement}
              />
            </div>
            {error && (
              <p
                className="text-xs font-medium"
                style={{ color: "var(--mazad-error, #E5484D)" }}
              >
                {error}
              </p>
            )}
          </div>
        )}

        {/* Place bid CTA */}
        {isLive && (
          <Button
            size="lg"
            disabled={loading}
            onClick={handleBid}
            className="mazad-glow-ring h-[52px] w-full rounded-xl text-base font-bold transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, var(--mazad-accent,#FF6A00), var(--mazad-accent-dark,#E65C00))",
              color: "white",
              border: "none",
              boxShadow: "0 4px 14px color-mix(in srgb, var(--mazad-accent) 35%, transparent)",
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {L.placingBid}
              </span>
            ) : (
              L.placeBid
            )}
          </Button>
        )}

        {/* Watchlist */}
        <Button
          variant="outline"
          size="default"
          onClick={handleWatchlist}
          className="h-11 w-full rounded-xl font-semibold transition-colors duration-200"
          style={{
            borderColor: "var(--mazad-primary, #1E5ECB)",
            color: "var(--mazad-primary, #1E5ECB)",
          }}
        >
          <Heart className="me-2 size-4" fill={watched ? "currentColor" : "none"} />
          {watched ? L.removeFromWatchlist : L.addToWatchlist}
        </Button>

        {/* Mini bid feed */}
        {bids.length > 0 && (
          <div
            className="flex flex-col gap-0 border-t pt-5"
            style={{ borderColor: "var(--mazad-separator, #F1F4F8)" }}
          >
            <p
              className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--mazad-muted-foreground, #8896AA)" }}
            >
              {L.recentBids}
            </p>
            {bids.slice(0, 4).map((bid, i) => (
              <div
                key={bid.id}
                className={`flex items-center justify-between py-1.5 ${
                  i < Math.min(bids.length, 4) - 1 ? "border-b" : ""
                } ${i === 0 ? "mazad-bid-slide-in" : ""}`}
                style={{ borderColor: "var(--mazad-surface, #F7F9FC)" }}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarFallback
                      className="text-[10px] font-bold text-white"
                      style={{ background: "var(--mazad-primary, #1E5ECB)" }}
                    >
                      {bid.bidderInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm" style={{ color: "var(--mazad-muted-foreground)" }}>
                    {bid.bidderName}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className="text-sm font-bold"
                    style={{
                      color:
                        i === 0
                          ? "var(--mazad-accent, #FF6A00)"
                          : "var(--mazad-navy, #071328)",
                    }}
                  >
                    {currency} {fmt(bid.amount)}
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--mazad-muted-foreground, #8896AA)" }}
                  >
                    {bid.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { icon: Lock, text: L.securePay },
            { icon: ShieldCheck, text: L.verifiedSeller },
            { icon: Zap, text: L.instantAlerts },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-center"
              style={{
                background: "var(--mazad-surface, #F7F9FC)",
                borderColor: "var(--mazad-separator, #E7EAF0)",
              }}
            >
              <Icon className="size-4" style={{ color: "var(--mazad-primary, #1E5ECB)" }} />
              <span
                className="text-[10px] font-semibold leading-tight"
                style={{ color: "var(--mazad-muted-foreground, #8896AA)" }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
