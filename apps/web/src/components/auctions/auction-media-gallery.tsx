"use client";

import { useState } from "react";

import type { AuctionMedia } from "@mazad/api";
import { cn } from "@mazad/ui/utils";
import { resolveAuctionMediaPath } from "@/lib/auction-media-url";

type AuctionMediaGalleryProps = {
  auctionId: number;
  mediaItems: AuctionMedia[];
  title: string;
  fallbackImageUrl?: string;
  noPhotosLabel: string;
};

function sortImages(items: AuctionMedia[]) {
  return [...items]
    .filter((item) => item.media_type === "image")
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function AuctionMediaGallery({
  auctionId,
  mediaItems,
  title,
  fallbackImageUrl = "/logo.png",
  noPhotosLabel,
}: AuctionMediaGalleryProps) {
  const images = sortImages(mediaItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-separator/60 bg-surface shadow-md">
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveAuctionMediaPath(auctionId, active.id, active.url)}
            alt={title}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-mazad-primary/8 via-surface to-light-blue/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fallbackImageUrl}
              alt=""
              aria-hidden
              className="size-24 object-contain opacity-90"
            />
          </div>
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-3 end-3 rounded-full bg-navy/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                aria-label={`${title} ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:size-20",
                  index === activeIndex
                    ? "border-mazad-primary shadow-sm ring-2 ring-mazad-primary/20"
                    : "border-separator/60 opacity-80 hover:border-mazad-primary/40 hover:opacity-100"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveAuctionMediaPath(auctionId, item.id, item.url)}
                  alt=""
                  className="size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : images.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground">{noPhotosLabel}</p>
      ) : null}
    </div>
  );
}
