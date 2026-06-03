"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { getAccessToken } from "@mazad/auth/session";
import { resolveAuctionMediaPath } from "@/lib/auction-media-url";
import { Skeleton } from "@mazad/ui";

type AuthenticatedMediaPreviewProps = {
  auctionId: number;
  mediaId: number;
  url?: string | null;
  mediaType: "image" | "video";
  alt: string;
  className?: string;
};

/**
 * Draft auction media requires JWT; plain <img src> cannot send Authorization.
 * Loads bytes via fetch + blob URL for owner preview in the listing wizard.
 */
export function AuthenticatedMediaPreview({
  auctionId,
  mediaId,
  url,
  mediaType,
  alt,
  className,
}: AuthenticatedMediaPreviewProps) {
  const t = useTranslations("listingWizard");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function load() {
      setFailed(false);
      setBlobUrl(null);
      const path = resolveAuctionMediaPath(auctionId, mediaId, url);
      const token = getAccessToken();
      try {
        const response = await fetch(path, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) {
          if (!cancelled) setFailed(true);
          return;
        }
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setBlobUrl(objectUrl);
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [auctionId, mediaId, url]);

  if (failed) {
    return (
      <div
        className={className}
        role="img"
        aria-label={alt}
      >
        <div className="flex h-full min-h-[120px] items-center justify-center bg-muted px-2 text-center text-xs text-muted-foreground">
          {t("previewUnavailable")}
        </div>
      </div>
    );
  }

  if (!blobUrl) {
    return <Skeleton className={className ?? "aspect-square w-full"} />;
  }

  if (mediaType === "video") {
    return (
      <video
        src={blobUrl}
        controls
        className={className}
        aria-label={alt}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={blobUrl} alt={alt} className={className} />
  );
}
