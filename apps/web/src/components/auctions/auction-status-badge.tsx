"use client";

import { useTranslations } from "next-intl";

import type { AuctionStatus } from "@mazad/api";
import { isAuctionEndedStatus } from "@mazad/api";
import { Badge, type badgeVariants } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";
import type { VariantProps } from "class-variance-authority";

const statusVariant: Record<
  string,
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>
> = {
  active: "live",
  scheduled: "active",
  ended: "sold",
  ended_without_bids: "sold",
  draft: "draft",
  approved: "active",
  under_review: "outline",
  returned_for_edit: "outline",
  rejected: "destructive",
  cancelled: "sold",
};

export function AuctionStatusBadge({ status }: { status: AuctionStatus }) {
  const t = useTranslations("auctions.status");
  const label = t.has(status)
    ? t(status)
    : isAuctionEndedStatus(status)
      ? t("ended")
      : status.replace(/_/g, " ");
  const variant = statusVariant[status] ?? "outline";

  return (
    <Badge variant={variant} className={cn(status === "active" && "shadow-sm")}>
      {label}
    </Badge>
  );
}
