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
    <div className="relative flex justify-center pb-0.5">
      {/* Dock glow — depth layer under the FAB */}
      <div
        className="pointer-events-none absolute bottom-1 size-14 rounded-full bg-mazad-accent/30 blur-lg motion-reduce:blur-sm"
        aria-hidden
      />

      <Link
        href={href}
        aria-label={t("addAuction")}
        className={cn(
          "group relative z-10 -mt-9 flex size-[3.75rem] shrink-0 cursor-pointer items-center justify-center rounded-full",
          "bg-gradient-to-b from-[#ff8533] via-mazad-accent to-accent-dark",
          "text-white",
          "shadow-[0_10px_28px_rgba(255,106,0,0.42),0_4px_12px_rgba(7,19,40,0.14),inset_0_1px_0_rgba(255,255,255,0.35)]",
          "ring-4 ring-card",
          "transition-[transform,box-shadow] duration-200 ease-out",
          "hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(255,106,0,0.5),0_6px_16px_rgba(7,19,40,0.16),inset_0_1px_0_rgba(255,255,255,0.4)]",
          "active:translate-y-0 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mazad-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          active &&
            "ring-mazad-primary/25 shadow-[0_12px_32px_rgba(255,106,0,0.55),0_4px_14px_rgba(7,19,40,0.14),inset_0_1px_0_rgba(255,255,255,0.35)]"
        )}
      >
        {/* Glass highlight */}
        <span
          className="pointer-events-none absolute inset-[3px] rounded-full bg-gradient-to-b from-white/40 via-white/10 to-transparent"
          aria-hidden
        />
        {/* Subtle rim */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/20"
          aria-hidden
        />
        <Plus
          className="relative size-7 stroke-[2.5] drop-shadow-sm transition-transform duration-200 ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100"
          aria-hidden
        />
      </Link>
    </div>
  );
}
