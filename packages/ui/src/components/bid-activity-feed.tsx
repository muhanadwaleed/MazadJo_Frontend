"use client"

/**
 * @motion-surface BidActivityFeed — Framer Motion (web auction only)
 */
import { motion } from "framer-motion"

import { fadeInUp, staggerContainer, staggerItem } from "../motion"
import { cn } from "../utils"

export type BidActivityItem = {
  id: string | number
  amount: string
  time: string
  bidder: string
}

export function BidActivityFeed({
  items,
  className,
  emptyMessage = "No bids yet",
}: {
  items: BidActivityItem[]
  className?: string
  emptyMessage?: string
}) {
  if (items.length === 0) {
    return (
      <p className={cn("py-6 text-center text-sm text-muted-foreground", className)}>
        {emptyMessage}
      </p>
    )
  }

  return (
    <motion.ul
      className={cn("space-y-2", className)}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {items.map((item) => (
        <motion.li
          key={item.id}
          layout
          variants={staggerItem}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between gap-3 rounded-xl border border-separator bg-card px-4 py-3 text-sm shadow-sm"
        >
          <div className="min-w-0">
            <p className="font-semibold text-navy">{item.amount}</p>
            <p className="truncate text-xs text-muted-foreground">{item.bidder}</p>
          </div>
          <time className="shrink-0 text-xs text-muted-foreground">{item.time}</time>
        </motion.li>
      ))}
    </motion.ul>
  )
}

export function BidActivityFeedAnimated({
  items,
  className,
}: {
  items: BidActivityItem[]
  className?: string
}) {
  return (
    <motion.div {...fadeInUp} className={className}>
      <BidActivityFeed items={items} />
    </motion.div>
  )
}
