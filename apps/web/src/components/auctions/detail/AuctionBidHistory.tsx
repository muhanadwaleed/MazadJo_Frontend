"use client";

/**
 * AuctionBidHistory
 * Full animated bid history (AnimatePresence slide-in on new bids).
 */

import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@mazad/ui";

export interface BidRecord {
  id: string;
  bidderName: string;
  bidderInitials: string;
  amount: number;
  timeAgo: string;
  /** Optional: colour swatch for the avatar — falls back to brand primary */
  avatarColor?: string;
}

interface AuctionBidHistoryProps {
  bids: BidRecord[];
  currency?: string;
  label?: string;
  emptyLabel?: string;
  numberLocale?: string;
}

export function AuctionBidHistory({
  bids,
  currency = "JOD",
  label = "Bid History",
  emptyLabel = "No bids yet — be the first to bid!",
  numberLocale = "en-JO",
}: AuctionBidHistoryProps) {
  const fmt = (n: number) => n.toLocaleString(numberLocale);

  return (
    <section
      className="rounded-2xl border p-6"
      style={{
        background: "var(--mazad-white, #ffffff)",
        borderColor: "var(--mazad-separator, #E7EAF0)",
      }}
    >
      <h2 className="mb-4 text-base font-bold" style={{ color: "var(--mazad-navy)" }}>
        {label}
      </h2>

      <AnimatePresence initial={false}>
        {bids.map((bid, i) => (
          <motion.div
            key={bid.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-between py-3"
            style={{
              borderBottom:
                i < bids.length - 1
                  ? "1px solid var(--mazad-surface, #F1F4F8)"
                  : "none",
            }}
          >
            {/* Bidder */}
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback
                  className="text-xs font-bold text-white"
                  style={{
                    background:
                      bid.avatarColor ?? "var(--mazad-primary, #1E5ECB)",
                  }}
                >
                  {bid.bidderInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--mazad-navy)" }}>
                  {bid.bidderName}
                </p>
                <p className="text-xs" style={{ color: "var(--mazad-muted-foreground, #8896AA)" }}>
                  {bid.timeAgo}
                </p>
              </div>
            </div>

            {/* Amount */}
            <p
              className="text-base font-black"
              style={{
                color:
                  i === 0
                    ? "var(--mazad-accent, #FF6A00)"
                    : "var(--mazad-navy, #071328)",
              }}
            >
              {currency} {fmt(bid.amount)}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>

      {bids.length === 0 && (
        <p className="py-6 text-center text-sm" style={{ color: "var(--mazad-muted-foreground)" }}>
          {emptyLabel}
        </p>
      )}
    </section>
  );
}
