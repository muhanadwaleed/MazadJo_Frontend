"use client"

/**
 * @motion-surface AuctionCardShell — Framer Motion (web auction only)
 */
import { motion } from "framer-motion"

import { cardHover, motionDuration, motionEase } from "../motion"
import { cn } from "../utils"
import { Card, CardContent, CardFooter } from "./card"
import { LiveAuctionIndicator } from "./live-auction-indicator"

export type AuctionCardLinkProps = {
  href: string
  className?: string
  "aria-label"?: string
  children?: React.ReactNode
}

export type AuctionCardShellProps = {
  title: string
  auctionNumber: string
  imageUrl?: string | null
  imageAlt?: string
  fallbackImageUrl?: string | null
  statusBadge: React.ReactNode
  isLive?: boolean
  currentBidLabel: string
  currentBid: string
  startingPriceLabel: string
  startingPrice: string
  timeRemaining?: React.ReactNode
  bidCountText?: string
  footer: React.ReactNode
  className?: string
  /** Overlay control on the image (e.g. watchlist heart). */
  imageAction?: React.ReactNode
  /** When set, the card body navigates to the auction detail page. */
  href?: string
  /** Defaults to `<a>` — pass Next.js `Link` from the app for client routing. */
  linkComponent?: React.ComponentType<AuctionCardLinkProps>
}

export function AuctionCardShell({
  title,
  auctionNumber,
  imageUrl,
  imageAlt,
  fallbackImageUrl,
  statusBadge,
  isLive = false,
  currentBidLabel,
  currentBid,
  startingPriceLabel,
  startingPrice,
  timeRemaining,
  bidCountText,
  footer,
  className,
  imageAction,
  href,
  linkComponent: LinkComponent,
}: AuctionCardShellProps) {
  const CardLink = LinkComponent ?? "a"

  return (
    <motion.article
      className={cn("h-full", className)}
      initial="rest"
      whileHover="hover"
      variants={cardHover}
      transition={{ duration: motionDuration.fast, ease: motionEase }}
    >
      <Card interactive className="relative h-full overflow-hidden p-0">
        {href ? (
          <CardLink
            href={href}
            className="absolute inset-0 z-[1] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={title}
          >
            <span className="sr-only">{title}</span>
          </CardLink>
        ) : null}

        <div className="pointer-events-none relative z-[2] aspect-[4/3] overflow-hidden bg-surface">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt ?? title}
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover/card:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-mazad-primary/8 via-surface to-light-blue/10">
              {fallbackImageUrl ? (
                <img
                  src={fallbackImageUrl}
                  alt=""
                  aria-hidden
                  className="size-24 object-contain opacity-90"
                />
              ) : (
                <span className="text-4xl font-bold text-mazad-primary/20">M</span>
              )}
            </div>
          )}
          <div className="absolute start-3 top-3 flex flex-wrap gap-2">
            {statusBadge}
            {isLive ? (
              <span className="rounded-full bg-card/95 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                <LiveAuctionIndicator />
              </span>
            ) : null}
          </div>
          {imageAction ? (
            <div className="pointer-events-auto absolute end-3 top-3 z-[3]">
              {imageAction}
            </div>
          ) : null}
        </div>

        <CardContent className="pointer-events-none relative z-[2] flex flex-1 flex-col gap-4 pt-5">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-navy">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">#{auctionNumber}</p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{currentBidLabel}</p>
              <p className="text-2xl font-bold tracking-tight text-navy">{currentBid}</p>
            </div>
            <div className="flex items-end justify-between gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">{startingPriceLabel}</p>
                <p className="font-medium text-foreground">{startingPrice}</p>
              </div>
              {bidCountText ? (
                <p className="text-end text-xs text-muted-foreground">{bidCountText}</p>
              ) : null}
            </div>
          </div>

          {timeRemaining ? (
            <div className="border-t border-separator pt-3">{timeRemaining}</div>
          ) : null}
        </CardContent>

        <CardFooter className="relative z-[2] mt-auto gap-2 pointer-events-auto">
          {footer}
        </CardFooter>
      </Card>
    </motion.article>
  )
}
