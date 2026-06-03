"use client"

import { cn } from "../utils"

export function LiveAuctionIndicator({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-mazad-accent uppercase",
        className
      )}
      role="status"
    >
      <span
        className="size-2 rounded-full bg-mazad-accent animate-[mazad-live-pulse_2s_ease-in-out_infinite]"
        aria-hidden
      />
      Live
    </span>
  )
}
