"use client";

import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";

import type { AuctionMedia } from "@mazad/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@mazad/ui";
import { cn } from "@mazad/ui/utils";
import { AuthenticatedMediaPreview } from "@/components/listings/authenticated-media-preview";
import { resolveAuctionMediaPath } from "@/lib/auction-media-url";

type AuctionMediaGalleryProps = {
  auctionId: number;
  mediaItems: AuctionMedia[];
  title: string;
  fallbackImageUrl?: string;
  noPhotosLabel: string;
  expandLabel?: string;
  closeLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Seller drafts need JWT — fetch media via blob URLs instead of raw src. */
  authenticated?: boolean;
};

function GalleryImage({
  auctionId,
  item,
  title,
  className,
  alt,
  authenticated,
}: {
  auctionId: number;
  item: AuctionMedia;
  title: string;
  className?: string;
  alt?: string;
  authenticated?: boolean;
}) {
  if (authenticated) {
    return (
      <AuthenticatedMediaPreview
        auctionId={auctionId}
        mediaId={item.id}
        url={item.url}
        mediaType="image"
        alt={alt ?? title}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolveAuctionMediaPath(auctionId, item.id, item.url)}
      alt={alt ?? title}
      className={className}
    />
  );
}

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
  expandLabel = "Expand image",
  closeLabel = "Close",
  previousLabel = "Previous image",
  nextLabel = "Next image",
  authenticated = false,
}: AuctionMediaGalleryProps) {
  const images = sortImages(mediaItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const active = images[activeIndex];

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, images.length]);

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % images.length);
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-separator/60 bg-surface shadow-md">
        {active ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group relative size-full cursor-zoom-in"
            aria-label={expandLabel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <GalleryImage
              auctionId={auctionId}
              item={active}
              title={title}
              authenticated={authenticated}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <ZoomIn className="size-3.5" aria-hidden />
              {expandLabel}
            </span>
          </button>
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
          <div className="pointer-events-none absolute bottom-3 end-3 rounded-full bg-navy/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
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
                <GalleryImage
                  auctionId={auctionId}
                  item={item}
                  title={title}
                  authenticated={authenticated}
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

      {active ? (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            showCloseButton={false}
            className="max-w-5xl border-none bg-navy/95 p-0 text-white"
          >
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <div className="relative">
              <DialogClose
                className="absolute end-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label={closeLabel}
              >
                <X className="size-5" aria-hidden />
              </DialogClose>

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute start-3 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                    aria-label={previousLabel}
                  >
                    <ChevronLeft className="size-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute end-3 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                    aria-label={nextLabel}
                  >
                    <ChevronRight className="size-5" aria-hidden />
                  </button>
                </>
              ) : null}

              <GalleryImage
                auctionId={auctionId}
                item={active}
                title={title}
                authenticated={authenticated}
                className="max-h-[85vh] w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
