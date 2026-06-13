/** Phase 8 — post-auction dispute records. */
export type DisputeStatus = "open" | "under_review" | "resolved" | "rejected" | string;

export type Dispute = {
  id: number;
  auction: number;
  opened_by: number;
  status: DisputeStatus;
  reason: string;
  resolution: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateDisputePayload = {
  auction: number;
  reason: string;
};
