import type { AuctionStatus } from "@mazad/api";

import { routes } from "@/config/routes";

export type SellerListingAction = "edit" | "submit" | "cancel" | "activate" | "view";

const EDITABLE: AuctionStatus[] = ["draft", "returned_for_edit"];
const CANCELLABLE: AuctionStatus[] = [
  "draft",
  "returned_for_edit",
  "under_review",
  "approved",
  "scheduled",
];

/** Statuses visible on the public marketplace detail page. */
const PUBLICLY_VIEWABLE: AuctionStatus[] = [
  "scheduled",
  "active",
  "ended",
  "ended_without_bids",
  "delivery_in_progress",
  "closed",
];

export function isPubliclyViewableListing(status: AuctionStatus): boolean {
  return PUBLICLY_VIEWABLE.includes(status);
}

/** Public auction page for live listings; seller preview for everything else. */
export function sellerListingViewHref(
  status: AuctionStatus,
  id: string | number
): string {
  return isPubliclyViewableListing(status)
    ? routes.auction(id)
    : routes.listingView(id);
}

export function needsSellerPayment(status: AuctionStatus): boolean {
  return status === "approved";
}

export function sellerListingActions(status: AuctionStatus): SellerListingAction[] {
  const actions: SellerListingAction[] = ["view"];

  if (EDITABLE.includes(status)) {
    actions.unshift("edit", "submit");
  }

  if (CANCELLABLE.includes(status)) {
    actions.push("cancel");
  }

  if (status === "approved") {
    actions.push("activate");
  }

  return actions;
}

export function canActivateListing(status: AuctionStatus): boolean {
  return status === "approved";
}

export function canEditListing(status: AuctionStatus): boolean {
  return EDITABLE.includes(status);
}

export function canSubmitListing(status: AuctionStatus): boolean {
  return EDITABLE.includes(status);
}

export function canCancelListing(status: AuctionStatus): boolean {
  return CANCELLABLE.includes(status);
}
