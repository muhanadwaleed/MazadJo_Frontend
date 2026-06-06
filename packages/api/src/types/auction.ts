export type AuctionStatus =
  | "draft"
  | "under_review"
  | "returned_for_edit"
  | "approved"
  | "scheduled"
  | "active"
  | "ended"
  | "ended_without_bids"
  | "delivery_in_progress"
  | "closed"
  | "cancelled"
  | "rejected"
  | string;

/** Auctions that finished without a sale path still in progress. */
export const AUCTION_ENDED_STATUSES = ["ended", "ended_without_bids"] as const;

export type AuctionEndedStatus = (typeof AUCTION_ENDED_STATUSES)[number];

export function isAuctionEndedStatus(
  status: string
): status is AuctionEndedStatus {
  return (AUCTION_ENDED_STATUSES as readonly string[]).includes(status);
}

export type AuctionListItem = {
  id: number;
  auction_number: string;
  title: string;
  status: AuctionStatus;
  start_price: string;
  current_price: string;
  min_bid_increment: string;
  starts_at: string;
  ends_at: string;
  participants_count: number;
  views_count: number;
  product_category: number;
  seller: number;
  primary_media_url?: string | null;
};

export type AuctionMedia = {
  id: number;
  media_type: string;
  file_data?: string | null;
  file_type: string;
  file_name: string;
  is_blurred: boolean;
  sort_order: number;
  url?: string;
};

export type AuctionWritePayload = {
  product_category: number;
  title: string;
  description: string;
  area?: number | null;
  location_link?: string;
  start_price: string;
  reserve_price?: string;
  min_bid_increment?: string;
  starts_at: string;
  ends_at: string;
  is_anonymous_bidding?: boolean;
};

export type AuctionDetail = AuctionListItem & {
  description: string;
  reserve_price: string;
  origin_deadline: string | null;
  extend_deadline: string | null;
  actual_end_at: string | null;
  extension_count: number;
  area: number | null;
  location_link: string;
  is_anonymous_bidding: boolean;
  winner_user: number | null;
  winner_bid: number | null;
  created_at: string;
  updated_at: string;
  media_items: AuctionMedia[];
  is_on_watchlist: boolean;
};

export type PublicBid = {
  id: number;
  amount: string;
  bidder: string;
  timestamp: string;
};

export type PlaceBidPayload = {
  amount: string;
  bid_source?: "manual" | "quick_increment";
};

export type PlacedBid = {
  id: number;
  auction: number;
  bidder: number;
  amount: string;
  increment_amount: string;
  bid_source: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
};
