"use client";

import { useTranslations } from "next-intl";

import { Button } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

type AuctionMobileBidBarProps = {
  currentPrice: string;
  status: string;
  className?: string;
};

export function AuctionMobileBidBar({
  currentPrice,
  status,
  className,
}: AuctionMobileBidBarProps) {
  const t = useTranslations("auctionDetail");

  if (status !== "active") return null;

  function scrollToBidPanel() {
    document.getElementById("auction-bid-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-separator bg-card/95 p-3 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur-md lg:hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{t("currentPrice")}</p>
          <p className="truncate text-lg font-bold text-navy">{currentPrice}</p>
        </div>
        <Button type="button" onClick={scrollToBidPanel} className="shrink-0">
          {t("placeBidCta")}
        </Button>
      </div>
    </div>
  );
}
