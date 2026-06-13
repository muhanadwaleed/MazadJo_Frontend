"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAddAuctionHref } from "@/components/auctions/add-auction-button";
import { Link, usePathname } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { cn } from "@mazad/ui/utils";

export function AddAuctionFab() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const href = useAddAuctionHref();
  const active =
    pathname.startsWith(routes.listingNew) ||
    pathname.includes("/dashboard/listings/");

  return (
    <Link
      href={href}
      aria-label={t("addAuction")}
      className={cn(
        "absolute start-1/2 top-0 z-50 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-mazad-accent text-white shadow-[0_4px_20px_rgba(232,93,44,0.45)] ring-4 ring-card transition-transform duration-200 hover:scale-105 active:scale-95",
        active && "ring-mazad-primary/25"
      )}
    >
      <Plus className="size-7 stroke-[2.5]" aria-hidden />
    </Link>
  );
}
