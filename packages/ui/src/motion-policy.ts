/**
 * Motion policy — Framer Motion is reserved for high-value auction surfaces.
 * Admin, tables, forms, and static pages use CSS transitions only (primitives).
 */

/** Components that may import `framer-motion`. */
export const MOTION_SURFACES = [
  "HeroSection",
  "AuctionCardShell",
  "CountdownTimer",
  "BidActivityFeed",
  "LiveAuctionIndicator",
] as const;

export type MotionSurface = (typeof MOTION_SURFACES)[number];

/** Primitives use CSS-only animation (tw-animate / transition-*). Safe for Admin. */
export const STATIC_PRIMITIVES = [
  "Button",
  "Card",
  "Dialog",
  "DropdownMenu",
  "Sheet",
  "Input",
  "Badge",
  "Avatar",
  "Skeleton",
  "Toaster",
] as const;

export function isMotionSurface(name: string): name is MotionSurface {
  return (MOTION_SURFACES as readonly string[]).includes(name);
}
