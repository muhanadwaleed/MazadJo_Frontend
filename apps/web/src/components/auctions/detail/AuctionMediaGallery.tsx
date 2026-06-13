"use client";

/**
 * AuctionMediaGallery
 * 4:3 main image with animated thumbnail strip (Framer Motion cross-fade).
 *
 * Image URLs are pre-resolved by the page (see resolveAuctionMediaPath) and
 * rendered with a plain <img>, matching how this app serves Django media
 * (no next/image remotePatterns are configured).
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AuctionMedia {
  url: string;
  alt?: string;
}

interface AuctionMediaGalleryProps {
  images: AuctionMedia[];
  title: string;
  /** Category icon fallback (Lucide node) */
  fallbackIcon?: React.ReactNode;
}

export function AuctionMediaGallery({
  images,
  title,
  fallbackIcon,
}: AuctionMediaGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-2.5">
      {/* Main image */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
        style={{ background: "var(--mazad-navy, #071328)" }}
      >
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.url}
                alt={current.alt ?? title}
                className="size-full object-cover"
              />
            </motion.div>
          ) : (
            <div className="flex size-full items-center justify-center opacity-30">
              {fallbackIcon ?? (
                <span
                  className="text-7xl font-black text-white"
                  style={{ opacity: 0.4 }}
                >
                  M
                </span>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(7,19,40,0.32) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={img.alt ?? `Image ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className="relative size-[70px] shrink-0 overflow-hidden rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
              style={{
                border:
                  i === active
                    ? "2.5px solid var(--mazad-accent, #FF6A00)"
                    : "2px solid transparent",
                opacity: i === active ? 1 : 0.6,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt ?? `${title} ${i + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
