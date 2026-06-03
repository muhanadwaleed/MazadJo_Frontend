import type { AuctionStatus } from "@mazad/api";

export type SellerListingAction = "edit" | "submit" | "cancel" | "view";

const EDITABLE: AuctionStatus[] = ["draft", "returned_for_edit"];
const CANCELLABLE: AuctionStatus[] = [
  "draft",
  "returned_for_edit",
  "under_review",
  "approved",
  "scheduled",
];

export function sellerListingActions(status: AuctionStatus): SellerListingAction[] {
  const actions: SellerListingAction[] = ["view"];

  if (EDITABLE.includes(status)) {
    actions.unshift("edit", "submit");
  }

  if (CANCELLABLE.includes(status)) {
    actions.push("cancel");
  }

  return actions;
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
